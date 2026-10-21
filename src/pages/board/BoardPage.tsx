import { useTranslation } from 'react-i18next';
import { renameBoard, useBoard } from '@/entities/board';
import { BoardCanvas } from '@/widgets/board-canvas';

export function BoardPage({ boardId }: { boardId: string }) {
  const { t } = useTranslation();
  const board = useBoard(boardId);

  if (board === undefined) return null;
  if (board === null) {
    return <p className="p-8 pt-20 text-center text-muted">{t('board.notFound')}</p>;
  }

  return (
    <div className="relative h-full">
      {/* The input has dir="auto", which would flip inset-inline-start, so position a wrapper instead. */}
      <div className="absolute start-16 top-3 z-30 h-10 w-[min(18rem,40vw)]">
        <input
          key={board.id}
          defaultValue={board.title}
          aria-label={t('board.titleLabel')}
          maxLength={80}
          dir="auto"
          onBlur={(e) => {
            const title = e.target.value.trim();
            if (title && title !== board.title) void renameBoard(board.id, title);
          }}
          className="size-full rounded-xl border border-border bg-surface/90 px-3 text-base font-bold shadow-lg outline-none backdrop-blur focus-visible:border-accent"
        />
      </div>
      <BoardCanvas boardId={board.id} />
    </div>
  );
}
