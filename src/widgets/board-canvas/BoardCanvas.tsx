import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import {
  Controls,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type Edge,
  type EdgeTypes,
  type NodeChange,
  type NodeTypes,
} from '@xyflow/react';
import { useTranslation } from 'react-i18next';
import {
  IdeaEdge,
  IdeaNode,
  collectSubtree,
  matchesTags,
  registerCanvasNodes,
  updateIdea,
  useIdeas,
  useSelection,
  useViewState,
  type IdeaFlowNode,
  type Point,
} from '@/entities/idea';
import { removeLink, useLinks } from '@/entities/link';
import { useNoteCounts } from '@/entities/note';
import {
  IdeaToolbar,
  addChild,
  addSibling,
  deleteIdea,
  linkIdeas,
  tidyBoard,
  toggleCollapsed,
} from '@/features/idea-actions';
import { useThemeStore } from '@/features/theme-switch';
import { recordChange } from '@/shared/lib';

const nodeTypes = { idea: IdeaNode } satisfies NodeTypes;
const edgeTypes = { idea: IdeaEdge } satisfies EdgeTypes;

function Canvas({ boardId }: { boardId: string }) {
  const { t } = useTranslation();
  const theme = useThemeStore((s) => s.theme);
  const { fitView, setCenter, getNodes, getViewport } = useReactFlow();
  const ideas = useIdeas(boardId);
  const links = useLinks(boardId);
  const noteCounts = useNoteCounts(boardId);
  const { selectedId, editingId, focus, pending, select, edit, reset, focusIdea, setPending } =
    useSelection();
  const { tagFilter, linkMode, setLinkMode } = useViewState();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const handledFocus = useRef(0);
  // Naming a freshly created idea is part of creating it, so it shares the creation's undo step.
  const freshId = useRef<string | null>(null);
  const [selectedLinkId, setSelectedLinkId] = useState<string | null>(null);
  // Positions of nodes currently being dragged; committed to IndexedDB on drag stop.
  const [dragging, setDragging] = useState<Record<string, Point>>({});

  useEffect(() => {
    reset();
    setLinkMode(false);
    handledFocus.current = 0;
    // A search result may have asked to focus an idea of this board.
    const next = useSelection.getState().pending;
    if (next) {
      focusIdea(next);
      setPending(null);
    }
    return reset;
  }, [boardId, reset, focusIdea, setPending, setLinkMode]);

  useEffect(() => {
    registerCanvasNodes(getNodes);
    return () => registerCanvasNodes(null);
  }, [getNodes]);

  // The outline and the search ask the canvas to pan to an idea (once its data has loaded).
  useEffect(() => {
    if (!focus || focus.n === handledFocus.current) return;
    const target = ideas?.find((i) => i.id === focus.id);
    if (!target) return;
    handledFocus.current = focus.n;
    void setCenter(target.x, target.y, { zoom: 1, duration: 400 });
  }, [focus, ideas, setCenter, pending]);

  // The details sheet shrinks the canvas, so bring a newly selected idea into view if it is not.
  useEffect(() => {
    if (!selectedId) return;
    const timer = setTimeout(() => {
      const idea = ideas?.find((i) => i.id === selectedId);
      const box = wrapperRef.current;
      if (!idea || !box) return;
      const { x, y, zoom } = getViewport();
      const sx = idea.x * zoom + x;
      const sy = idea.y * zoom + y;
      const visible =
        sx > 60 && sx < box.clientWidth - 60 && sy > 110 && sy < box.clientHeight - 120;
      if (!visible) void setCenter(idea.x, idea.y, { zoom, duration: 250 });
    }, 80);
    return () => clearTimeout(timer);
    // Only when the selection changes, not when ideas move.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  // Leaving the editor unmounts the focused textarea; give focus back so shortcuts keep working.
  const stopEditing = () => {
    edit(null);
    wrapperRef.current?.focus();
  };

  const selected = ideas?.find((i) => i.id === selectedId);

  // Ideas behind a collapsed idea are hidden; remember how many each collapsed idea hides.
  const { hidden, hiddenCounts } = useMemo(() => {
    const hiddenIds = new Set<string>();
    const counts: Record<string, number> = {};
    for (const idea of ideas ?? []) {
      if (!idea.collapsed) continue;
      const below = collectSubtree(ideas ?? [], idea.id).filter((id) => id !== idea.id);
      counts[idea.id] = below.length;
      below.forEach((id) => hiddenIds.add(id));
    }
    return { hidden: hiddenIds, hiddenCounts: counts };
  }, [ideas]);

  const nodes = useMemo<IdeaFlowNode[]>(() => {
    const parents = new Set((ideas ?? []).map((i) => i.parentId));
    return (ideas ?? [])
      .filter((idea) => !hidden.has(idea.id))
      .map((idea) => ({
        id: idea.id,
        type: 'idea',
        position: dragging[idea.id] ?? { x: idea.x, y: idea.y },
        selected: idea.id === selectedId,
        data: {
          text: idea.text,
          color: idea.color,
          isRoot: idea.parentId === null,
          hasDetails: !!idea.description || (noteCounts?.[idea.id] ?? 0) > 0,
          dimmed: tagFilter.length > 0 && !matchesTags(idea.tags, tagFilter),
          hasChildren: parents.has(idea.id),
          collapsed: idea.collapsed,
          hiddenCount: hiddenCounts[idea.id] ?? 0,
          editing: idea.id === editingId,
          onToggleCollapse: () => void toggleCollapsed(idea.id, !idea.collapsed),
          onEditStart: () => edit(idea.id),
          onEditCancel: stopEditing,
          onCommit: async (text: string) => {
            stopEditing();
            if (text === idea.text) return;
            if (freshId.current === idea.id) freshId.current = null;
            else await recordChange(boardId);
            await updateIdea(idea.id, { text });
          },
        },
      }));
    // stopEditing and edit only touch a ref and the store, so they are safe to leave out.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    ideas,
    hidden,
    hiddenCounts,
    dragging,
    selectedId,
    editingId,
    noteCounts,
    tagFilter,
    boardId,
  ]);

  const edges = useMemo<Edge[]>(() => {
    const tree = (ideas ?? [])
      .filter((i) => i.parentId !== null && !hidden.has(i.id))
      .map((i) => ({
        id: `e-${i.id}`,
        source: i.parentId!,
        target: i.id,
        type: 'idea',
        style: { stroke: 'var(--edge)', strokeWidth: 2.5 },
      }));
    const free = (links ?? [])
      .filter((l) => !hidden.has(l.fromId) && !hidden.has(l.toId))
      .map((l) => ({
        id: `l-${l.id}`,
        source: l.fromId,
        target: l.toId,
        type: 'idea',
        selected: l.id === selectedLinkId,
        interactionWidth: 24,
        style: {
          stroke: 'var(--accent)',
          strokeWidth: l.id === selectedLinkId ? 4 : 2.5,
          strokeDasharray: '7 6',
        },
      }));
    return [...tree, ...free];
  }, [ideas, links, hidden, selectedLinkId]);

  const onNodesChange = (changes: NodeChange<IdeaFlowNode>[]) => {
    for (const c of changes) {
      if (c.type === 'position' && c.position) {
        const { id, position } = c;
        setDragging((d) => ({ ...d, [id]: position }));
      }
    }
  };

  const focusNew = (id: string | null) => {
    if (!id) return;
    freshId.current = id;
    select(id);
    edit(id);
  };

  const onAddChild = async () =>
    selectedId && focusNew(await addChild(boardId, selectedId, t('idea.new')));
  const onAddSibling = async () =>
    selectedId && focusNew(await addSibling(boardId, selectedId, t('idea.new')));
  const onDelete = async () => {
    if (selectedLinkId) {
      await recordChange(boardId);
      await removeLink(selectedLinkId);
      setSelectedLinkId(null);
      return;
    }
    if (!selectedId) return;
    await deleteIdea(boardId, selectedId);
    select(null);
  };
  const onColor = async (color: number) => {
    if (!selectedId) return;
    await recordChange(boardId);
    await updateIdea(selectedId, { color });
  };
  const onTidy = async () => {
    await tidyBoard(boardId);
    requestAnimationFrame(() => void fitView({ duration: 300, padding: 0.25 }));
  };

  const onNodeClick = async (nodeId: string) => {
    setSelectedLinkId(null);
    if (linkMode && selectedId && nodeId !== selectedId) {
      await linkIdeas(boardId, selectedId, nodeId);
      setLinkMode(false);
      return;
    }
    select(nodeId);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if ((e.target as HTMLElement).matches('input, textarea, select')) return;
    const handlers: Record<string, () => unknown> = {
      Tab: onAddChild,
      Enter: onAddSibling,
      Delete: onDelete,
      Backspace: onDelete,
      F2: () => selectedId && edit(selectedId),
      Escape: () => {
        setLinkMode(false);
        setSelectedLinkId(null);
        select(null);
      },
    };
    const handler = handlers[e.key];
    if (!handler) return;
    e.preventDefault();
    void handler();
  };

  // tabIndex=-1: clicks focus this wrapper so shortcuts work without nodes stealing focus.
  return (
    <div
      ref={wrapperRef}
      dir="ltr"
      tabIndex={-1}
      className="size-full outline-none"
      style={{ background: 'radial-gradient(circle at 50% 50%, var(--surface) 0, var(--bg) 70%)' }}
      onKeyDown={onKeyDown}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        nodeOrigin={[0.5, 0.5]}
        colorMode={theme}
        onNodesChange={onNodesChange}
        onNodeClick={(_, node) => void onNodeClick(node.id)}
        onEdgeClick={(_, edge) => {
          if (!edge.id.startsWith('l-')) return;
          select(null);
          setSelectedLinkId(edge.id.slice(2));
          wrapperRef.current?.focus();
        }}
        onPaneClick={() => {
          select(null);
          setSelectedLinkId(null);
        }}
        onNodeDragStart={(_, node) => select(node.id)}
        onNodeDragStop={async (_, node) => {
          await recordChange(boardId);
          await updateIdea(node.id, { x: node.position.x, y: node.position.y });
          setDragging((d) => {
            const next = { ...d };
            delete next[node.id];
            return next;
          });
        }}
        nodesConnectable={false}
        nodesFocusable={false}
        edgesFocusable={false}
        deleteKeyCode={null}
        fitView
        fitViewOptions={{ padding: 0.25, maxZoom: 1.1 }}
        minZoom={0.2}
      >
        <Controls showInteractive={false} position="bottom-left" />
        <Panel position="bottom-center">
          <div className="flex flex-col items-center gap-2">
            <p className="rounded-lg bg-surface/80 px-3 py-1 text-xs text-muted" dir="auto">
              {linkMode ? t('idea.linkHint') : t('idea.hint')}
            </p>
            <IdeaToolbar
              selectedId={selectedId}
              selectedColor={selected?.color ?? 0}
              canDelete={(!!selected && selected.parentId !== null) || !!selectedLinkId}
              linkMode={linkMode}
              onAddChild={() => void onAddChild()}
              onAddSibling={() => void onAddSibling()}
              onColor={(c) => void onColor(c)}
              onToggleLink={() => setLinkMode(!linkMode)}
              onDelete={() => void onDelete()}
              onTidy={() => void onTidy()}
            />
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}

export function BoardCanvas({ boardId }: { boardId: string }) {
  return (
    <ReactFlowProvider>
      <Canvas boardId={boardId} />
    </ReactFlowProvider>
  );
}
