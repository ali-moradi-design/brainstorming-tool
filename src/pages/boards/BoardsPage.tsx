import { useTranslation } from 'react-i18next';
import { BoardCard, useBoards } from '@/entities/board';
import { CreateBoardForm } from '@/features/board-create';
import { DeleteBoardButton } from '@/features/board-delete';
import { boardPath, navigate } from '@/shared/lib';

export function BoardsPage() {
  const { t } = useTranslation();
  const boards = useBoards();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-10">
      <section className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">{t('app.title')}</h1>
        <p className="text-muted">{t('app.tagline')}</p>
        <CreateBoardForm onCreated={(id) => navigate(boardPath(id))} />
      </section>
      <section aria-labelledby="boards-title" className="flex flex-col gap-3">
        <h2 id="boards-title" className="text-xl font-semibold">
          {t('boards.title')}
        </h2>
        {boards?.length === 0 && <p className="text-muted">{t('boards.empty')}</p>}
        <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2">
          {boards?.map((board) => (
            <BoardCard
              key={board.id}
              board={board}
              onOpen={() => navigate(boardPath(board.id))}
              actions={<DeleteBoardButton boardId={board.id} />}
            />
          ))}
        </ul>
      </section>
    </div>
  );
}
