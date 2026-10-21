import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelection } from '@/entities/idea';
import { boardPath, navigate } from '@/shared/lib';
import { Button, SearchIcon } from '@/shared/ui';
import { searchAll, type SearchHit } from './search';
import { useSearch } from './searchStore';

export function SearchButton() {
  const { t } = useTranslation();
  const setOpen = useSearch((s) => s.setOpen);
  return (
    <Button
      onClick={() => setOpen(true)}
      aria-label={t('search.open')}
      title={`${t('search.open')} (Ctrl+K)`}
      data-testid="search-open"
      className="w-9 px-0"
    >
      <SearchIcon />
    </Button>
  );
}

/** Command-palette style search over everything; opened with Ctrl/Cmd+K. */
export function SearchDialog() {
  const { t } = useTranslation();
  const { open, setOpen } = useSearch();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(!useSearch.getState().open);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setOpen]);

  if (!open) return null;
  return <Dialog title={t('search.title')} onClose={() => setOpen(false)} />;
}

function Dialog({ title, onClose }: { title: string; onClose: () => void }) {
  const { t } = useTranslation();
  const setPending = useSelection((s) => s.setPending);
  const [query, setQuery] = useState('');
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => inputRef.current?.focus(), []);

  useEffect(() => {
    let stale = false;
    void searchAll(query).then((result) => {
      if (stale) return;
      setHits(result);
      setActive(0);
    });
    return () => {
      stale = true;
    };
  }, [query]);

  const choose = (hit: SearchHit | undefined) => {
    if (!hit) return;
    setPending(hit.ideaId);
    navigate(boardPath(hit.boardId));
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-[12vh]"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="flex max-h-[70vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl"
        onKeyDown={(e) => {
          if (e.key === 'Escape') onClose();
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActive((a) => Math.min(a + 1, hits.length - 1));
          }
          if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActive((a) => Math.max(a - 1, 0));
          }
          if (e.key === 'Enter') choose(hits[active]);
        }}
      >
        <input
          ref={inputRef}
          value={query}
          dir="auto"
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('search.placeholder')}
          aria-label={t('search.placeholder')}
          className="h-14 border-b border-border bg-transparent px-5 text-base outline-none placeholder:text-muted"
        />
        <ul role="listbox" className="m-0 min-h-0 flex-1 list-none overflow-y-auto p-2">
          {query.trim() && hits.length === 0 && (
            <li className="px-3 py-6 text-center text-sm text-muted">{t('search.empty')}</li>
          )}
          {hits.map((hit, i) => (
            <li key={`${hit.kind}-${hit.ideaId}-${i}`} role="option" aria-selected={i === active}>
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onClick={() => choose(hit)}
                className={`flex w-full flex-col gap-0.5 rounded-xl px-3 py-2 text-start ${i === active ? 'bg-accent text-accent-fg' : ''}`}
              >
                <span className="flex items-center gap-2 text-sm font-semibold" dir="auto">
                  <span className="rounded-md bg-black/15 px-1.5 text-[10px] uppercase">
                    {t(`search.kind.${hit.kind}`)}
                  </span>
                  <span className="truncate">{hit.title}</span>
                </span>
                <span className="truncate text-xs opacity-80" dir="auto">
                  {hit.boardTitle}
                  {hit.snippet ? ` · ${hit.snippet}` : ''}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
