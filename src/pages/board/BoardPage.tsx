import { useTranslation } from 'react-i18next';
import { renameBoard, useBoard } from '@/entities/board';
import { useIdeas, useSelection, useViewState } from '@/entities/idea';
import { IdeaDetailsPanel } from '@/features/idea-details';
import { useSidebar } from '@/widgets/app-sidebar';
import { BoardBar } from '@/widgets/board-bar';
import { BoardCanvas } from '@/widgets/board-canvas';
import { IdeaList } from '@/widgets/idea-list';

export function BoardPage({ boardId }: { boardId: string }) {
  const { t } = useTranslation();
  const board = useBoard(boardId);
  const ideas = useIdeas(boardId);
  const sidebarOpen = useSidebar((s) => s.open);
  const view = useViewState((s) => s.view);
  const { selectedId, select } = useSelection();

  if (board === undefined) return null;
  if (board === null) {
    return <p className="p-8 pt-20 text-center text-muted">{t('board.notFound')}</p>;
  }

  const selected = ideas?.find((i) => i.id === selectedId);
  const inset = sidebarOpen ? 'start-4' : 'start-16';

  return (
    <div className="relative h-full">
      {view === 'map' ? <BoardCanvas boardId={board.id} /> : <IdeaList boardId={board.id} />}
      {/* The input has dir="auto", which would flip inset-inline-start, so position a wrapper instead. */}
      <div className={`absolute ${inset} top-3 z-30 h-10 w-[min(18rem,40vw)]`}>
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
      <div className={`absolute ${inset} top-[3.75rem] z-30`}>
        <BoardBar boardId={board.id} title={board.title} />
      </div>
      {selected && (
        <IdeaDetailsPanel key={selected.id} idea={selected} onClose={() => select(null)} />
      )}
    </div>
  );
}
