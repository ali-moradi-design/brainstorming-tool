import { lazy, Suspense } from 'react';
import { BoardsPage } from '@/pages/boards';
import { matchBoardId, useHashPath } from '@/shared/lib';
import { AppHeader } from '@/widgets/app-header';

// The canvas pulls in @xyflow/react, so load it only when a board is opened.
const BoardPage = lazy(() => import('@/pages/board').then((m) => ({ default: m.BoardPage })));

export function App() {
  const boardId = matchBoardId(useHashPath());

  return (
    <>
      <AppHeader />
      <main>
        {boardId ? (
          <Suspense fallback={null}>
            <BoardPage boardId={boardId} />
          </Suspense>
        ) : (
          <BoardsPage />
        )}
      </main>
    </>
  );
}
