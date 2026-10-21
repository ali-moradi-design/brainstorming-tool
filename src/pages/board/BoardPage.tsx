import { useTranslation } from 'react-i18next';
import { renameBoard, useBoard } from '@/entities/board';
import { BoardCanvas } from '@/widgets/board-canvas';
import { ArrowIcon } from '@/shared/ui';

export function BoardPage({ boardId }: { boardId: string }) {
  const { t } = useTranslation();
  const board = useBoard(boardId);

  if (board === undefined) return null;
  if (board === null) {
    return <p className="p-8 text-center text-muted">{t('board.notFound')}</p>;
  }

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] flex-col">
      <div className="flex items-center gap-3 border-b border-border px-4 py-2">
        <a
          href="#/"
          className="flex items-center gap-1 text-sm text-muted no-underline hover:text-text"
        >
          <ArrowIcon className="rtl:rotate-180" />
          {t('nav.back')}
        </a>
        <input
          key={board.id}
          defaultValue={board.title}
          aria-label={t('board.titleLabel')}
          maxLength={80}
          onBlur={(e) => {
            const title = e.target.value.trim();
            if (title && title !== board.title) void renameBoard(board.id, title);
          }}
          className="min-w-0 flex-1 bg-transparent text-lg font-semibold outline-none focus-visible:underline"
        />
      </div>
      <div className="min-h-0 flex-1">
        <BoardCanvas boardId={board.id} />
      </div>
    </div>
  );
}
