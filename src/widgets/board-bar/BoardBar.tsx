import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { allTags, useIdeas, useViewState } from '@/entities/idea';
import { ExportMenu } from '@/features/export-board';
import { useHistory } from '@/shared/lib';
import { Button, ListIcon, MapIcon, RedoIcon, UndoIcon } from '@/shared/ui';

type Props = { boardId: string; title: string };

/** Board-level tools: view switch, undo/redo, search, export and the tag filter. */
export function BoardBar({ boardId, title }: Props) {
  const { t } = useTranslation();
  const ideas = useIdeas(boardId);
  const { view, setView, tagFilter, toggleTag, clearTags } = useViewState();
  const { undo, redo } = useHistory();
  const canUndo = useHistory((s) => (s.past[boardId]?.length ?? 0) > 0);
  const canRedo = useHistory((s) => (s.future[boardId]?.length ?? 0) > 0);
  const tags = allTags(ideas ?? []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey) || (e.target as HTMLElement).matches('input, textarea, select'))
        return;
      const key = e.key.toLowerCase();
      if (key === 'z' && !e.shiftKey) {
        e.preventDefault();
        void undo(boardId);
      } else if ((key === 'z' && e.shiftKey) || key === 'y') {
        e.preventDefault();
        void redo(boardId);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [boardId, undo, redo]);

  return (
    <div className="flex max-w-[calc(100vw-2rem)] flex-wrap items-center gap-1.5 rounded-2xl border border-border bg-surface/90 p-1.5 shadow-lg backdrop-blur">
      <div role="group" aria-label={t('bar.view')} className="flex gap-1">
        <Button
          variant={view === 'map' ? 'primary' : 'ghost'}
          onClick={() => setView('map')}
          aria-pressed={view === 'map'}
          title={t('bar.map')}
          aria-label={t('bar.map')}
          data-testid="view-map"
          className="w-9 px-0"
        >
          <MapIcon />
        </Button>
        <Button
          variant={view === 'list' ? 'primary' : 'ghost'}
          onClick={() => setView('list')}
          aria-pressed={view === 'list'}
          title={t('bar.list')}
          aria-label={t('bar.list')}
          data-testid="view-list"
          className="w-9 px-0"
        >
          <ListIcon />
        </Button>
      </div>
      <span aria-hidden className="mx-0.5 h-6 w-px bg-border" />
      <Button
        onClick={() => void undo(boardId)}
        disabled={!canUndo}
        title={`${t('bar.undo')} (Ctrl+Z)`}
        aria-label={t('bar.undo')}
        data-testid="undo"
        className="w-9 px-0"
      >
        <UndoIcon />
      </Button>
      <Button
        onClick={() => void redo(boardId)}
        disabled={!canRedo}
        title={`${t('bar.redo')} (Ctrl+Shift+Z)`}
        aria-label={t('bar.redo')}
        data-testid="redo"
        className="w-9 px-0"
      >
        <RedoIcon />
      </Button>
      <ExportMenu boardId={boardId} title={title} canExportImage={view === 'map'} />
      {tags.length > 0 && (
        <>
          <span aria-hidden className="mx-0.5 h-6 w-px bg-border" />
          <ul
            aria-label={t('bar.tags')}
            className="m-0 flex max-w-[40vw] list-none gap-1 overflow-x-auto p-0"
          >
            {tags.map((tag) => (
              <li key={tag}>
                <button
                  type="button"
                  aria-pressed={tagFilter.includes(tag)}
                  onClick={() => toggleTag(tag)}
                  className="whitespace-nowrap rounded-full border border-border px-2.5 py-1 text-xs aria-pressed:border-transparent aria-pressed:bg-accent aria-pressed:text-accent-fg focus-visible:outline-2 focus-visible:outline-accent"
                >
                  #{tag}
                </button>
              </li>
            ))}
          </ul>
          {tagFilter.length > 0 && (
            <Button onClick={clearTags} className="h-7 px-2 text-xs">
              {t('bar.clearTags')}
            </Button>
          )}
        </>
      )}
    </div>
  );
}
