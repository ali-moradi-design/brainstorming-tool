import { useTranslation } from 'react-i18next';
import { useIdeas } from '@/entities/idea';
import { addLink, removeLink, useLinks } from '@/entities/link';
import type { IdeaRecord } from '@/shared/api';
import { recordChange } from '@/shared/lib';
import { fieldClass } from './FieldsSection';

/** Free links to other ideas (links that are not the parent/child tree). */
export function LinksSection({ idea }: { idea: IdeaRecord }) {
  const { t } = useTranslation();
  const ideas = useIdeas(idea.boardId) ?? [];
  const links = (useLinks(idea.boardId) ?? []).filter(
    (l) => l.fromId === idea.id || l.toId === idea.id,
  );
  const textOf = (id: string) => ideas.find((i) => i.id === id)?.text ?? '?';
  const linkedIds = new Set(links.flatMap((l) => [l.fromId, l.toId]));
  const candidates = ideas.filter((i) => i.id !== idea.id && !linkedIds.has(i.id));

  return (
    <section className="flex flex-col gap-2" aria-labelledby="links-title">
      <h3 id="links-title" className="text-sm font-semibold text-muted">
        {t('details.links')}
      </h3>
      {links.length === 0 && <p className="text-sm text-muted">{t('details.noLinks')}</p>}
      <ul className="m-0 flex list-none flex-col gap-1 p-0">
        {links.map((l) => {
          const other = l.fromId === idea.id ? l.toId : l.fromId;
          return (
            <li
              key={l.id}
              className="flex items-center justify-between gap-2 rounded-lg bg-bg px-3 py-1.5 text-sm"
            >
              <span dir="auto" className="truncate">
                {textOf(other)}
              </span>
              <button
                type="button"
                aria-label={t('details.removeLink')}
                title={t('details.removeLink')}
                onClick={async () => {
                  await recordChange(idea.boardId);
                  await removeLink(l.id);
                }}
                className="rounded px-1 hover:text-accent focus-visible:outline-2 focus-visible:outline-accent"
              >
                ✕
              </button>
            </li>
          );
        })}
      </ul>
      {candidates.length > 0 && (
        <select
          aria-label={t('details.addLink')}
          value=""
          onChange={async (e) => {
            // Read the value first: the controlled select resets to "" while we await.
            const targetId = e.target.value;
            if (!targetId) return;
            await recordChange(idea.boardId);
            await addLink(idea.boardId, idea.id, targetId);
          }}
          className={`${fieldClass} h-10 py-0`}
        >
          <option value="">{t('details.addLink')}</option>
          {candidates.map((c) => (
            <option key={c.id} value={c.id}>
              {c.text}
            </option>
          ))}
        </select>
      )}
    </section>
  );
}
