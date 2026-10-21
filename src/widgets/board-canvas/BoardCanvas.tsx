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
  updateIdea,
  useIdeas,
  useSelection,
  type IdeaFlowNode,
  type Point,
} from '@/entities/idea';
import { useNoteCounts } from '@/entities/note';
import { IdeaDetailsPanel } from '@/features/idea-details';
import { IdeaToolbar, addChild, addSibling, deleteIdea, tidyBoard } from '@/features/idea-actions';
import { useThemeStore } from '@/features/theme-switch';

const nodeTypes = { idea: IdeaNode } satisfies NodeTypes;
const edgeTypes = { idea: IdeaEdge } satisfies EdgeTypes;

function Canvas({ boardId }: { boardId: string }) {
  const { t } = useTranslation();
  const theme = useThemeStore((s) => s.theme);
  const { fitView, setCenter } = useReactFlow();
  const ideas = useIdeas(boardId);
  const noteCounts = useNoteCounts(boardId);
  const { selectedId, editingId, focus, select, edit, reset } = useSelection();
  const wrapperRef = useRef<HTMLDivElement>(null);
  // Positions of nodes currently being dragged; committed to IndexedDB on drag stop.
  const [dragging, setDragging] = useState<Record<string, Point>>({});

  useEffect(() => {
    reset();
    return reset;
  }, [boardId, reset]);

  // The sidebar outline asks the canvas to pan to an idea.
  useEffect(() => {
    const target = focus && ideas?.find((i) => i.id === focus.id);
    if (target) void setCenter(target.x, target.y, { zoom: 1, duration: 400 });
    // Only react to new focus requests, not to every idea change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focus, setCenter]);

  // Leaving the editor unmounts the focused textarea; give focus back so shortcuts keep working.
  const stopEditing = () => {
    edit(null);
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
          hasDetails: !!idea.description || (noteCounts?.[idea.id] ?? 0) > 0,
          editing: idea.id === editingId,
          onEditStart: () => edit(idea.id),
          onEditCancel: stopEditing,
          onCommit: (text: string) => {
            stopEditing();
            if (text !== idea.text) void updateIdea(idea.id, { text });
          },
        },
      })),
    // stopEditing and edit are stable enough for rendering; they only touch refs and the store.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ideas, dragging, selectedId, editingId, noteCounts],
  );

  const edges = useMemo<Edge[]>(
    () =>
      (ideas ?? [])
        .filter((i) => i.parentId !== null)
        .map((i) => ({
          id: `e-${i.id}`,
          source: i.parentId!,
          target: i.id,
          type: 'idea',
          style: { stroke: 'var(--edge)', strokeWidth: 2.5 },
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
    select(id);
    edit(id);
  };

  const onAddChild = async () =>
    selectedId && focusNew(await addChild(boardId, selectedId, t('idea.new')));
  const onAddSibling = async () =>
    selectedId && focusNew(await addSibling(boardId, selectedId, t('idea.new')));
  const onDelete = async () => {
    if (!selectedId) return;
    await deleteIdea(boardId, selectedId);
    select(null);
  };
  const onTidy = async () => {
    await tidyBoard(boardId);
    requestAnimationFrame(() => void fitView({ duration: 300, padding: 0.25 }));
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if ((e.target as HTMLElement).matches('input, textarea, select')) return;
    const handlers: Record<string, () => unknown> = {
      Tab: onAddChild,
      Enter: onAddSibling,
      Delete: onDelete,
      Backspace: onDelete,
      F2: () => selectedId && edit(selectedId),
      Escape: () => select(null),
    };
    const handler = handlers[e.key];
    if (!handler) return;
    e.preventDefault();
    void handler();
  };

  // tabIndex=-1: clicks focus this wrapper so shortcuts work without nodes stealing focus.
  return (
    <div className="relative size-full">
      <div
        ref={wrapperRef}
        dir="ltr"
        tabIndex={-1}
        className="size-full outline-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, var(--surface) 0, var(--bg) 70%)',
        }}
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
          onNodeClick={(_, node) => select(node.id)}
          onPaneClick={() => select(null)}
          onNodeDragStart={(_, node) => select(node.id)}
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
          fitViewOptions={{ padding: 0.25, maxZoom: 1.1 }}
          minZoom={0.2}
        >
          <Controls showInteractive={false} position="bottom-left" />
          <Panel position="bottom-center">
            <div className="flex flex-col items-center gap-2">
              <p className="rounded-lg bg-surface/80 px-3 py-1 text-xs text-muted" dir="auto">
                {t('idea.hint')}
              </p>
              <IdeaToolbar
                selectedId={selectedId}
                selectedColor={selected?.color ?? 0}
                canDelete={!!selected && selected.parentId !== null}
                onAddChild={() => void onAddChild()}
                onAddSibling={() => void onAddSibling()}
                onDelete={() => void onDelete()}
                onTidy={() => void onTidy()}
              />
            </div>
          </Panel>
        </ReactFlow>
      </div>
      {/* Outside the LTR canvas so it follows the page direction (left side in RTL). */}
      {selected && (
        <IdeaDetailsPanel key={selected.id} idea={selected} onClose={() => select(null)} />
      )}
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
