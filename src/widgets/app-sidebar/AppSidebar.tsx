import { useTranslation } from 'react-i18next';
import { BoardListItem, useBoards } from '@/entities/board';
import { buildOutline, useIdeas, useSelection } from '@/entities/idea';
import { CreateBoardForm } from '@/features/board-create';
import { DeleteBoardButton } from '@/features/board-delete';
import { boardPath, navigate } from '@/shared/lib';
import { Button, LogoIcon, SidebarIcon } from '@/shared/ui';
import { useSidebar } from './store';

/** Always-visible button that collapses or expands the sidebar. */
export function SidebarToggle() {
  const { t } = useTranslation();
  const { open, toggle } = useSidebar();
  const label = open ? t('sidebar.collapse') : t('sidebar.expand');
  return (
    <Button
      onClick={toggle}
      aria-label={label}
      title={label}
      aria-expanded={open}
      data-testid="sidebar-toggle"
      className="absolute start-3 top-3 z-30 w-10 bg-surface/90 px-0 shadow-lg backdrop-blur"
    >
      <SidebarIcon className="rtl:-scale-x-100" />
    </Button>
  );
}

export function AppSidebar({ boardId }: { boardId: string | null }) {
  const { t } = useTranslation();
  const open = useSidebar((s) => s.open);

  return (
    <nav
      aria-label={t('sidebar.title')}
      inert={!open}
      data-testid="sidebar"
      data-open={open}
      className={`relative z-40 flex shrink-0 flex-col overflow-hidden border-border bg-surface transition-[width] duration-200 max-md:absolute max-md:inset-y-0 max-md:start-0 ${open ? 'w-72 border-e' : 'w-0'}`}
    >
      <div className="flex w-72 min-h-0 flex-1 flex-col gap-4 p-4 pt-16">
        <a
          href="#/"
          className="flex items-center gap-2 text-lg font-extrabold text-text no-underline"
        >
          <LogoIcon className="text-accent" width={24} height={24} />
          {t('app.title')}
        </a>
        <CreateBoardForm compact onCreated={(id) => navigate(boardPath(id))} />
        <Projects boardId={boardId} />
        {boardId && <Outline boardId={boardId} />}
      </div>
    </nav>
  );
}

function Projects({ boardId }: { boardId: string | null }) {
  const { t } = useTranslation();
  const boards = useBoards();
  return (
    <section aria-labelledby="projects-title" className="flex min-h-0 max-h-[40%] flex-col gap-2">
      <h2 id="projects-title" className="text-xs font-semibold uppercase tracking-wider text-muted">
        {t('sidebar.projects')}
      </h2>
      {boards?.length === 0 && <p className="text-sm text-muted">{t('boards.empty')}</p>}
      <ul className="m-0 flex list-none flex-col gap-0.5 overflow-y-auto p-0">
        {boards?.map((board) => (
          <BoardListItem
            key={board.id}
            board={board}
            active={board.id === boardId}
            onOpen={() => navigate(boardPath(board.id))}
            actions={<DeleteBoardButton boardId={board.id} />}
          />
        ))}
      </ul>
    </section>
  );
}

function Outline({ boardId }: { boardId: string }) {
  const { t } = useTranslation();
  const ideas = useIdeas(boardId);
  const { selectedId, focusIdea } = useSelection();
  const rows = buildOutline(ideas ?? []);

  return (
    <section aria-labelledby="outline-title" className="flex min-h-0 flex-1 flex-col gap-2">
      <h2 id="outline-title" className="text-xs font-semibold uppercase tracking-wider text-muted">
        {t('sidebar.outline')}
      </h2>
      <ul className="m-0 flex list-none flex-col gap-0.5 overflow-y-auto p-0">
        {rows.map(({ idea, depth }) => (
          <li key={idea.id} style={{ paddingInlineStart: depth * 14 }}>
            <button
              type="button"
              dir="auto"
              onClick={() => focusIdea(idea.id)}
              aria-current={idea.id === selectedId ? 'true' : undefined}
              className={`w-full truncate rounded-lg px-2 py-1.5 text-start text-sm focus-visible:outline-2 focus-visible:outline-accent ${idea.id === selectedId ? 'bg-accent font-semibold text-accent-fg' : depth === 0 ? 'font-semibold hover:bg-surface-2' : 'text-muted hover:bg-surface-2 hover:text-text'}`}
            >
              {idea.text}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
