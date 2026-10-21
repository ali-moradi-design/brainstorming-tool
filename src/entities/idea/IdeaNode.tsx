import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';

export type IdeaNodeData = {
  text: string;
  color: number;
  isRoot: boolean;
  /** True when the idea has a description or notes. */
  hasDetails: boolean;
  editing: boolean;
  onCommit: (text: string) => void;
  onEditStart: () => void;
  onEditCancel: () => void;
};

export type IdeaFlowNode = Node<IdeaNodeData, 'idea'>;

export function IdeaNode({ data, selected }: NodeProps<IdeaFlowNode>) {
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
      className={`relative min-w-24 max-w-56 rounded-full border-2 text-center font-semibold shadow-sm ${data.isRoot ? 'px-9 py-4 text-xl' : 'px-5 py-2 text-sm'}`}
    >
      {/* Edges are floating (see IdeaEdge); these handles only anchor React Flow. */}
      <Handle type="target" position={Position.Top} className="!pointer-events-none !opacity-0" />
      {data.editing ? <Editor data={data} /> : <span className="break-words">{data.text}</span>}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!pointer-events-none !opacity-0"
      />
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
      data.onCommit(value.trim() || data.text);
    } else if (e.key === 'Escape') {
      data.onEditCancel();
    }
  };

  return (
    <textarea
      ref={ref}
      rows={2}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => data.onCommit(value.trim() || data.text)}
      onKeyDown={onKeyDown}
      className="nodrag nowheel w-full resize-none bg-transparent text-center outline-none"
    />
  );
}
