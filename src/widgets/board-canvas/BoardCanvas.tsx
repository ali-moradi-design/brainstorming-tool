import { useMemo, useRef, useState, type KeyboardEvent } from 'react';
import {
  Background,
  Controls,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type Edge,
  type NodeChange,
  type NodeTypes,
} from '@xyflow/react';
import { useTranslation } from 'react-i18next';
import { IdeaNode, updateIdea, useIdeas, type IdeaFlowNode, type Point } from '@/entities/idea';
import { IdeaToolbar, addChild, addSibling, deleteIdea, tidyBoard } from '@/features/idea-actions';
import { useThemeStore } from '@/features/theme-switch';

const nodeTypes = { idea: IdeaNode } satisfies NodeTypes;

function Canvas({ boardId }: { boardId: string }) {
  const { t } = useTranslation();
  const theme = useThemeStore((s) => s.theme);
  const { fitView } = useReactFlow();
  const ideas = useIdeas(boardId);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  // Positions of nodes currently being dragged; committed to IndexedDB on drag stop.
  const [dragging, setDragging] = useState<Record<string, Point>>({});

  // Leaving the editor unmounts the focused textarea; give focus back so shortcuts keep working.
  const stopEditing = () => {
    setEditingId(null);
    wrapperRef.current?.focus();
  };

  const selected = ideas?.find((i) => i.id === selectedId);

  const nodes = useMemo<IdeaFlowNode[]>(
    () =>
      (ideas ?? []).map((idea) => ({
        id: idea.id,
        type: 'idea',
        position: dragging[idea.id] ?? { x: idea.x, y: idea.y },
        selected: idea.id === selectedId,
        data: {
          text: idea.text,
          color: idea.color,
          isRoot: idea.parentId === null,
          editing: idea.id === editingId,
          onEditStart: () => setEditingId(idea.id),
          onEditCancel: stopEditing,
          onCommit: (text: string) => {
            stopEditing();
            if (text !== idea.text) void updateIdea(idea.id, { text });
          },
        },
      })),
    [ideas, dragging, selectedId, editingId],
  );

  const edges = useMemo<Edge[]>(
    () =>
      (ideas ?? [])
        .filter((i) => i.parentId !== null)
        .map((i) => ({
          id: `e-${i.id}`,
          source: i.parentId!,
          target: i.id,
          type: 'smoothstep',
          style: { stroke: 'var(--edge)', strokeWidth: 2 },
        })),
    [ideas],
  );

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
    setSelectedId(id);
    setEditingId(id);
  };

  const onAddChild = async () =>
    selectedId && focusNew(await addChild(boardId, selectedId, t('idea.new')));
  const onAddSibling = async () =>
    selectedId && focusNew(await addSibling(boardId, selectedId, t('idea.new')));
  const onDelete = async () => {
    if (!selectedId) return;
    await deleteIdea(boardId, selectedId);
    setSelectedId(null);
  };
  const onTidy = async () => {
    await tidyBoard(boardId);
    requestAnimationFrame(() => void fitView({ duration: 300, padding: 0.3 }));
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if ((e.target as HTMLElement).matches('input, textarea, select')) return;
    const handlers: Record<string, () => unknown> = {
      Tab: onAddChild,
      Enter: onAddSibling,
      Delete: onDelete,
      Backspace: onDelete,
      F2: () => selectedId && setEditingId(selectedId),
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
      onKeyDown={onKeyDown}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        colorMode={theme}
        onNodesChange={onNodesChange}
        onNodeClick={(_, node) => setSelectedId(node.id)}
        onPaneClick={() => setSelectedId(null)}
        onNodeDragStart={(_, node) => setSelectedId(node.id)}
        onNodeDragStop={async (_, node) => {
          await updateIdea(node.id, { x: node.position.x, y: node.position.y });
          setDragging((d) => {
            const next = { ...d };
            delete next[node.id];
            return next;
          });
        }}
        nodesConnectable={false}
        nodesFocusable={false}
        deleteKeyCode={null}
        fitView
        fitViewOptions={{ padding: 0.3, maxZoom: 1.2 }}
        minZoom={0.2}
      >
        <Background gap={24} color="var(--border)" />
        <Controls showInteractive={false} />
        <Panel position="top-center">
          <IdeaToolbar
            selectedId={selectedId}
            selectedColor={selected?.color ?? 0}
            canDelete={!!selected && selected.parentId !== null}
            onAddChild={() => void onAddChild()}
            onAddSibling={() => void onAddSibling()}
            onDelete={() => void onDelete()}
            onTidy={() => void onTidy()}
          />
        </Panel>
        <Panel position="bottom-center">
          <p className="rounded-lg bg-surface/80 px-3 py-1 text-xs text-muted" dir="auto">
            {t('idea.hint')}
          </p>
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
