import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';
import { useTranslation } from 'react-i18next';

export type IdeaNodeData = {
  text: string;
  color: number;
  isRoot: boolean;
  /** True when the idea has a description or notes. */
  hasDetails: boolean;
  /** Dimmed by the tag filter. */
  dimmed: boolean;
  hasChildren: boolean;
  collapsed: boolean;
  /** Number of ideas hidden behind a collapsed idea. */
  hiddenCount: number;
  onToggleCollapse: () => void;
  editing: boolean;
  onCommit: (text: string) => void;
  onEditStart: () => void;
  onEditCancel: () => void;
};

export type IdeaFlowNode = Node<IdeaNodeData, 'idea'>;

export function IdeaNode({ data, selected }: NodeProps<IdeaFlowNode>) {
  const { t } = useTranslation();
  const c = data.color;
  return (
    <div
      dir="auto"
      onDoubleClick={data.onEditStart}
      data-testid="idea-node"
      data-selected={selected}
      style={{
        background: `var(--idea-${c}-bg)`,
        color: `var(--idea-${c}-fg)`,
        borderColor: selected ? 'var(--accent)' : `var(--idea-${c}-border, transparent)`,
        boxShadow: selected
          ? '0 0 0 4px color-mix(in srgb, var(--accent) 40%, transparent)'
          : undefined,
      }}
      className={`group relative min-w-24 max-w-56 rounded-full border-2 text-center font-semibold shadow-sm transition-opacity ${data.dimmed ? 'opacity-25' : ''} ${data.isRoot ? 'px-9 py-4 text-xl' : 'px-5 py-2 text-sm'}`}
    >
      {/* Edges are floating (see IdeaEdge); these handles only anchor React Flow. */}
      <Handle type="target" position={Position.Top} className="!pointer-events-none !opacity-0" />
      {data.editing ? <Editor data={data} /> : <span className="break-words">{data.text}</span>}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!pointer-events-none !opacity-0"
      />
      {data.hasChildren && !data.editing && (
        <button
          type="button"
          className={`nodrag absolute -end-3 top-1/2 flex h-5 min-w-5 -translate-y-1/2 items-center justify-center rounded-full border-2 border-bg bg-surface px-1 text-[10px] font-bold text-text shadow ${data.collapsed ? '' : 'opacity-0 group-hover:opacity-100 focus-visible:opacity-100'}`}
          aria-label={data.collapsed ? t('idea.expand') : t('idea.collapse')}
          aria-expanded={!data.collapsed}
          data-testid="collapse-toggle"
          onClick={(e) => {
            e.stopPropagation();
            data.onToggleCollapse();
          }}
          onDoubleClick={(e) => e.stopPropagation()}
        >
          {data.collapsed ? `+${data.hiddenCount}` : '−'}
        </button>
      )}
      {data.hasDetails && !data.editing && (
        <span
          aria-hidden
          className="absolute -end-1 -top-1 size-3 rounded-full border-2 border-bg bg-accent"
        />
      )}
    </div>
  );
}

function Editor({ data }: { data: IdeaNodeData }) {
  const [value, setValue] = useState(data.text);
  const ref = useRef<HTMLTextAreaElement>(null);
  // Enter/Escape unmount the textarea, which also fires blur; only the first outcome may count.
  const finished = useRef(false);
  const finish = (action: () => void) => {
    if (finished.current) return;
    finished.current = true;
    action();
  };

  // New nodes stay `visibility: hidden` until React Flow has measured them, and a hidden
  // element cannot take focus, so retry for a few frames.
  useEffect(() => {
    let frame = 0;
    let tries = 0;
    const focus = () => {
      const el = ref.current;
      if (!el) return;
      el.focus();
      if (document.activeElement === el) el.select();
      else if (tries++ < 30) frame = requestAnimationFrame(focus);
    };
    frame = requestAnimationFrame(focus);
    return () => cancelAnimationFrame(frame);
  }, []);

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    e.stopPropagation();
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      finish(() => data.onCommit(value.trim() || data.text));
    } else if (e.key === 'Escape') {
      finish(data.onEditCancel);
    }
  };

  return (
    <textarea
      ref={ref}
      rows={2}
      maxLength={500}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => finish(() => data.onCommit(value.trim() || data.text))}
      onKeyDown={onKeyDown}
      className="nodrag nowheel w-full resize-none bg-transparent text-center outline-none"
    />
  );
}
