import { lazy, Suspense } from 'react';
import { SearchDialog } from '@/features/global-search';
import { BoardsPage } from '@/pages/boards';
import { matchBoardId, useHashPath } from '@/shared/lib';
import { AppSidebar, SidebarToggle } from '@/widgets/app-sidebar';
import { TopControls } from '@/widgets/top-controls';

// The canvas pulls in @xyflow/react, so load it only when a board is opened.
const BoardPage = lazy(() => import('@/pages/board').then((m) => ({ default: m.BoardPage })));

export function App() {
  const boardId = matchBoardId(useHashPath());

  return (
    <div className="relative flex h-dvh overflow-hidden">
      <AppSidebar boardId={boardId} />
      <main className="relative min-w-0 flex-1 overflow-y-auto">
        <SidebarToggle />
        <TopControls />
        <SearchDialog />
        {boardId ? (
          <Suspense fallback={null}>
            <BoardPage boardId={boardId} />
          </Suspense>
        ) : (
          <div className="pt-12">
            <BoardsPage />
          </div>
        )}
      </main>
    </div>
  );
}
