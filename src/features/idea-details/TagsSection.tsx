import { useState, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { allTags, updateIdea, useIdeas } from '@/entities/idea';
import type { IdeaRecord } from '@/shared/api';
import { recordChange } from '@/shared/lib';
import { fieldClass } from './FieldsSection';

const clean = (raw: string) => raw.trim().toLowerCase().replace(/^#/, '').slice(0, 24);

export function TagsSection({ idea }: { idea: IdeaRecord }) {
  const { t } = useTranslation();
  const ideas = useIdeas(idea.boardId);
  const [draft, setDraft] = useState('');

  const save = async (tags: string[]) => {
    await recordChange(idea.boardId);
    await updateIdea(idea.id, { tags });
  };

  const add = () => {
    const tag = clean(draft);
    setDraft('');
    if (tag && !idea.tags.includes(tag)) void save([...idea.tags, tag]);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      add();
    }
  };

  return (
    <section className="flex flex-col gap-2" aria-labelledby="tags-title">
      <h3 id="tags-title" className="text-sm font-semibold text-muted">
        {t('details.tags')}
      </h3>
      <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
        {idea.tags.map((tag) => (
          <li
            key={tag}
            className="flex items-center gap-1 rounded-full bg-surface-2 py-0.5 ps-3 pe-1 text-xs"
          >
            #{tag}
            <button
              type="button"
              aria-label={t('details.removeTag', { tag })}
              onClick={() => void save(idea.tags.filter((x) => x !== tag))}
              className="rounded-full px-1.5 hover:bg-accent hover:text-accent-fg focus-visible:outline-2 focus-visible:outline-accent"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
      <input
        value={draft}
        list="board-tags"
        dir="auto"
        placeholder={t('details.tagPlaceholder')}
        aria-label={t('details.tagPlaceholder')}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={add}
        className={`${fieldClass} h-10 py-0`}
      />
      <datalist id="board-tags">
        {allTags(ideas ?? []).map((tag) => (
          <option key={tag} value={tag} />
        ))}
      </datalist>
    </section>
  );
}
