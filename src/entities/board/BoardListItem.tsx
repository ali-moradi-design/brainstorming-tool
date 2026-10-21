import type { ReactNode } from 'react';
import type { BoardRecord } from '@/shared/api';

type Props = { board: BoardRecord; active: boolean; onOpen: () => void; actions?: ReactNode };

export function BoardListItem({ board, active, onOpen, actions }: Props) {
  return (
    <li
      className={`group flex items-center gap-1 rounded-xl ${active ? 'bg-accent text-accent-fg' : 'hover:bg-surface-2'}`}
    >
      <button
        type="button"
        onClick={onOpen}
        aria-current={active ? 'page' : undefined}
        className="min-w-0 flex-1 truncate rounded-xl px-3 py-2 text-start text-sm font-medium focus-visible:outline-2 focus-visible:outline-accent"
      >
        {board.title}
      </button>
      {actions && (
        <span className="pe-1 opacity-0 focus-within:opacity-100 group-hover:opacity-100">
          {actions}
        </span>
      )}
    </li>
  );
}
