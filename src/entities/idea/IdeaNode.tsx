import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';

export type IdeaNodeData = {
  text: string;
  color: number;
  isRoot: boolean;
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
        borderColor: selected ? 'var(--accent-strong)' : `var(--idea-${c}-border, transparent)`,
        boxShadow: selected ? '0 0 0 3px var(--accent)' : undefined,
      }}
      className={`min-w-32 max-w-56 rounded-xl border-2 px-4 py-2 text-center text-sm shadow-sm ${data.isRoot ? 'text-base font-semibold' : ''}`}
    >
      <Handle type="target" position={Position.Left} className="!size-2 !border-0 !bg-accent" />
      {data.editing ? <Editor data={data} /> : <span className="break-words">{data.text}</span>}
      <Handle type="source" position={Position.Right} className="!size-2 !border-0 !bg-accent" />
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
