import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { BoardRecord } from '@/shared/api';

type Props = { board: BoardRecord; onOpen: () => void; actions?: ReactNode };

export function BoardCard({ board, onOpen, actions }: Props) {
  const { t, i18n } = useTranslation();
  const date = new Date(board.updatedAt).toLocaleDateString(i18n.language, { dateStyle: 'medium' });

  return (
    <li className="group relative flex flex-col gap-2 rounded-2xl border border-border bg-surface p-4 transition-colors hover:border-accent">
      <button
        type="button"
        onClick={onOpen}
        className="text-start focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        <span className="block text-lg font-semibold">{board.title}</span>
        <span className="block text-sm text-muted">{t('boards.updated', { date })}</span>
      </button>
      {actions && (
        <div className="absolute end-3 top-3 opacity-0 group-hover:opacity-100 focus-within:opacity-100">
          {actions}
        </div>
      )}
    </li>
  );
}
