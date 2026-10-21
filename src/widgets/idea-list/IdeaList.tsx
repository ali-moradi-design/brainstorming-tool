import { useTranslation } from 'react-i18next';
import { buildOutline, matchesTags, useIdeas, useSelection, useViewState } from '@/entities/idea';
import { useNoteCounts } from '@/entities/note';

/** Flat, readable alternative to the map: every idea as a row, honoring the tag filter. */
export function IdeaList({ boardId }: { boardId: string }) {
  const { t } = useTranslation();
  const ideas = useIdeas(boardId);
  const noteCounts = useNoteCounts(boardId);
  const tagFilter = useViewState((s) => s.tagFilter);
  const { selectedId, select } = useSelection();
  const rows = buildOutline(ideas ?? []).filter(({ idea }) => matchesTags(idea.tags, tagFilter));

  return (
    <div className="size-full overflow-y-auto px-4 pb-8 pt-28">
      <ul
        aria-label={t('bar.list')}
        data-testid="idea-list"
        className="m-0 mx-auto flex max-w-3xl list-none flex-col gap-2 p-0"
      >
        {rows.length === 0 && <li className="py-10 text-center text-muted">{t('list.empty')}</li>}
        {rows.map(({ idea, depth }) => (
          <li key={idea.id} style={{ marginInlineStart: Math.min(depth, 4) * 20 }}>
            <button
              type="button"
              onClick={() => select(idea.id)}
              aria-current={idea.id === selectedId ? 'true' : undefined}
              className={`flex w-full items-start gap-3 rounded-2xl border bg-surface p-4 text-start transition-colors hover:border-accent focus-visible:outline-2 focus-visible:outline-accent ${idea.id === selectedId ? 'border-accent' : 'border-border'}`}
            >
              <span
                aria-hidden
                className="mt-1 size-3 shrink-0 rounded-full border border-border"
                style={{ background: `var(--idea-${idea.color}-bg)` }}
              />
              <span className="min-w-0 flex-1">
                <span className="block font-semibold" dir="auto">
                  {idea.text}
                </span>
                {idea.description && (
                  <span className="mt-0.5 line-clamp-2 block text-sm text-muted" dir="auto">
                    {idea.description}
                  </span>
                )}
                {(idea.tags.length > 0 || (noteCounts?.[idea.id] ?? 0) > 0) && (
                  <span className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-muted">
                    {idea.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-surface-2 px-2 py-0.5 text-text">
                        #{tag}
                      </span>
                    ))}
                    {(noteCounts?.[idea.id] ?? 0) > 0 && (
                      <span>{t('list.notes', { count: noteCounts?.[idea.id] })}</span>
                    )}
                  </span>
                )}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
