import { memo, useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
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
  IdeaNodeActionsContext,
  collectSubtree,
  matchesTags,
  registerCanvasNodes,
  updateIdea,
  useIdeas,
  useSelection,
  useViewState,
  type IdeaFlowNode,
  type IdeaNodeActions,
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
import { recordChange, shallowEqual, useEvent, useStableItems } from '@/shared/lib';

const nodeTypes = { idea: IdeaNode } satisfies NodeTypes;
const edgeTypes = { idea: IdeaEdge } satisfies EdgeTypes;
const nodeOrigin: [number, number] = [0.5, 0.5];
const fitViewOptions = { padding: 0.25, maxZoom: 1.1 };
const treeStyle = { stroke: 'var(--edge)', strokeWidth: 2.5 };
const linkStyle = { stroke: 'var(--accent)', strokeWidth: 2.5, strokeDasharray: '7 6' };
const selectedLinkStyle = { ...linkStyle, strokeWidth: 4 };

// Live queries return new objects on every change; keep the old node when nothing visible changed.
type Size = { width: number; height: number };
const sameSize = (a?: Size, b?: Size) => a?.width === b?.width && a?.height === b?.height;

const sameNode = (a: IdeaFlowNode, b: IdeaFlowNode) =>
  a.selected === b.selected &&
  sameSize(a.measured as Size | undefined, b.measured as Size | undefined) &&
  a.position.x === b.position.x &&
  a.position.y === b.position.y &&
  shallowEqual(a.data, b.data);

function Canvas({ boardId }: { boardId: string }) {
  const { t } = useTranslation();
  const theme = useThemeStore((s) => s.theme);
  const { fitView, setCenter, getNodes, getViewport } = useReactFlow();
  const ideas = useIdeas(boardId);
  const links = useLinks(boardId);
  const noteCounts = useNoteCounts(boardId);
  // Narrow selectors: this component should not re-render for unrelated store fields.
  const selectedId = useSelection((s) => s.selectedId);
  const detailsId = useSelection((s) => s.detailsId);
  const editingId = useSelection((s) => s.editingId);
  const focus = useSelection((s) => s.focus);
  const { select, edit, reset, focusIdea, setPending } = useSelection.getState();
  const tagFilter = useViewState((s) => s.tagFilter);
  const linkMode = useViewState((s) => s.linkMode);
  const { setLinkMode } = useViewState.getState();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const handledFocus = useRef(0);
  // Naming a freshly created idea is part of creating it, so it shares the creation's undo step.
  const freshId = useRef<string | null>(null);
  const [selectedLinkId, setSelectedLinkId] = useState<string | null>(null);
  // Positions of nodes currently being dragged; committed to IndexedDB on drag stop.
  const [dragging, setDragging] = useState<Record<string, Point>>({});
  // Measured node sizes must be passed back: React Flow forgets them whenever a node object
  // changes, which drew nodes off by half their size (with nodeOrigin 0.5) until re-measured.
  const [sizes, setSizes] = useState<Record<string, Size>>({});

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
  }, [focus, ideas, setCenter]);

  // The details sheet shrinks the canvas, so bring the idea it shows into view if it is not.
  useEffect(() => {
    if (!detailsId) return;
    const timer = setTimeout(() => {
      const idea = ideas?.find((i) => i.id === detailsId);
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
    // Only when the sheet opens or switches ideas, not when ideas move.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detailsId]);

  // Leaving the editor unmounts the focused textarea; give focus back so shortcuts keep working.
  const stopEditing = useEvent(() => {
    edit(null);
    wrapperRef.current?.focus();
  });

  // One stable object for all nodes, so editing or collapsing never re-renders the other nodes.
  const nodeActions = useMemo<IdeaNodeActions>(
    () => ({
      toggleCollapse: (id, collapsed) => void toggleCollapsed(id, !collapsed),
      startEdit: (id) => edit(id),
      cancelEdit: stopEditing,
      commit: async (id, text, previous) => {
        stopEditing();
        if (text === previous) return;
        if (freshId.current === id) freshId.current = null;
        else await recordChange(boardId);
        await updateIdea(id, { text });
      },
    }),
    [boardId, edit, stopEditing],
  );

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

  const freshNodes = useMemo<IdeaFlowNode[]>(() => {
    const parents = new Set((ideas ?? []).map((i) => i.parentId));
    return (ideas ?? [])
      .filter((idea) => !hidden.has(idea.id))
      .map((idea) => ({
        id: idea.id,
        type: 'idea',
        position: dragging[idea.id] ?? { x: idea.x, y: idea.y },
        measured: sizes[idea.id],
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
        },
      }));
  }, [ideas, hidden, hiddenCounts, dragging, sizes, selectedId, editingId, noteCounts, tagFilter]);
  const nodes = useStableItems(freshNodes, sameNode);

  const freshEdges = useMemo<Edge[]>(() => {
    const tree = (ideas ?? [])
      .filter((i) => i.parentId !== null && !hidden.has(i.id))
      .map((i) => ({
        id: `e-${i.id}`,
        source: i.parentId!,
        target: i.id,
        type: 'idea',
        style: treeStyle,
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
        style: l.id === selectedLinkId ? selectedLinkStyle : linkStyle,
      }));
    return [...tree, ...free];
  }, [ideas, links, hidden, selectedLinkId]);
  const edges = useStableItems(freshEdges, shallowEqual);

  const onNodesChange = useEvent((changes: NodeChange<IdeaFlowNode>[]) => {
    const moved: Record<string, Point> = {};
    const resized: Record<string, Size> = {};
    for (const c of changes) {
      if (c.type === 'position' && c.position) moved[c.id] = c.position;
      if (c.type === 'dimensions' && c.dimensions) resized[c.id] = c.dimensions;
    }
    if (Object.keys(moved).length > 0) setDragging((d) => ({ ...d, ...moved }));
    if (Object.keys(resized).length > 0) {
      setSizes((s) =>
        Object.entries(resized).every(([id, r]) => sameSize(s[id], r)) ? s : { ...s, ...resized },
      );
    }
  });

  const focusNew = (id: string | null) => {
    if (!id) return;
    freshId.current = id;
    select(id);
    edit(id);
  };

  const onAddChild = useEvent(
    async () => selectedId && focusNew(await addChild(boardId, selectedId, t('idea.new'))),
  );
  const onAddSibling = useEvent(
    async () => selectedId && focusNew(await addSibling(boardId, selectedId, t('idea.new'))),
  );
  const onDelete = useEvent(async () => {
    if (selectedLinkId) {
      await recordChange(boardId);
      await removeLink(selectedLinkId);
      setSelectedLinkId(null);
      return;
    }
    if (!selectedId) return;
    await deleteIdea(boardId, selectedId);
    select(null);
  });
  const onColor = useEvent(async (color: number) => {
    if (!selectedId) return;
    await recordChange(boardId);
    await updateIdea(selectedId, { color });
  });
  const onTidy = useEvent(async () => {
    await tidyBoard(boardId);
    requestAnimationFrame(() => void fitView({ duration: 300, padding: 0.25 }));
  });
  const onToggleLink = useEvent(() => setLinkMode(!linkMode));

  const onNodeClick = useEvent(async (_: unknown, node: IdeaFlowNode) => {
    const nodeId = node.id;
    setSelectedLinkId(null);
    if (linkMode && selectedId && nodeId !== selectedId) {
      await linkIdeas(boardId, selectedId, nodeId);
      setLinkMode(false);
      return;
    }
    select(nodeId, { waitForDoubleClick: true });
  });
  const onEdgeClick = useEvent((_: unknown, edge: Edge) => {
    if (!edge.id.startsWith('l-')) return;
    select(null);
    setSelectedLinkId(edge.id.slice(2));
    wrapperRef.current?.focus();
  });
  const onPaneClick = useEvent(() => {
    select(null);
    setSelectedLinkId(null);
  });
  const onNodeDragStart = useEvent((_: unknown, node: IdeaFlowNode) => select(node.id));
  const onNodeDragStop = useEvent(async (_: unknown, node: IdeaFlowNode) => {
    await recordChange(boardId);
    await updateIdea(node.id, { x: node.position.x, y: node.position.y });
    setDragging((d) => {
      const next = { ...d };
      delete next[node.id];
      return next;
    });
  });

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
      <IdeaNodeActionsContext value={nodeActions}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          nodeOrigin={nodeOrigin}
          colorMode={theme}
          onNodesChange={onNodesChange}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          onPaneClick={onPaneClick}
          onNodeDragStart={onNodeDragStart}
          onNodeDragStop={onNodeDragStop}
          nodesConnectable={false}
          nodesFocusable={false}
          edgesFocusable={false}
          deleteKeyCode={null}
          fitView
          fitViewOptions={fitViewOptions}
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
                onAddChild={onAddChild}
                onAddSibling={onAddSibling}
                onColor={onColor}
                onToggleLink={onToggleLink}
                onDelete={onDelete}
                onTidy={onTidy}
              />
            </div>
          </Panel>
        </ReactFlow>
      </IdeaNodeActionsContext>
    </div>
  );
}

export const BoardCanvas = memo(function BoardCanvas({ boardId }: { boardId: string }) {
  return (
    <ReactFlowProvider>
      <Canvas boardId={boardId} />
    </ReactFlowProvider>
  );
});
