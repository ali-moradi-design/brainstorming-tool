import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IDEA_COLORS, updateIdea } from '@/entities/idea';
import { addNote, removeNote, updateNote, useIdeaNotes } from '@/entities/note';
import type { IdeaRecord } from '@/shared/api';
import { Button, PlusIcon, TrashIcon } from '@/shared/ui';

type Props = { idea: IdeaRecord; onClose: () => void };

const field =
  'w-full resize-y rounded-xl border border-border bg-bg p-3 text-sm text-text placeholder:text-muted focus-visible:outline-2 focus-visible:outline-accent';

/** Right-hand panel: title, color, description and a list of separate notes for one idea. */
export function IdeaDetailsPanel({ idea, onClose }: Props) {
  const { t, i18n } = useTranslation();
  const notes = useIdeaNotes(idea.id);
  const [draft, setDraft] = useState('');

  const submitNote = async () => {
    const text = draft.trim();
    if (!text) return;
    setDraft('');
    await addNote(idea.boardId, idea.id, text);
  };

  return (
    <aside
      aria-label={t('details.title')}
      data-testid="details-panel"
      className="absolute bottom-0 end-0 top-[4.5rem] z-20 flex w-[min(24rem,100%)] flex-col gap-4 overflow-y-auto border-s border-border bg-surface p-5 shadow-2xl"
    >
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-bold">{t('details.title')}</h2>
        <Button
          onClick={onClose}
          aria-label={t('details.close')}
          title={t('details.close')}
          className="w-9 px-0"
        >
          ✕
        </Button>
      </div>

      <label className="flex flex-col gap-1 text-sm text-muted">
        {t('details.text')}
        <input
          defaultValue={idea.text}
          maxLength={120}
          dir="auto"
          onBlur={(e) => {
            const text = e.target.value.trim();
            if (text && text !== idea.text) void updateIdea(idea.id, { text });
          }}
          className={`${field} h-10 py-0 font-semibold`}
        />
      </label>

      <div
        className="flex flex-col gap-1 text-sm text-muted"
        role="group"
        aria-label={t('details.color')}
      >
        {t('details.color')}
        <div className="flex gap-2">
          {IDEA_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              aria-label={t('idea.color', { n: c + 1 })}
              aria-pressed={idea.color === c}
              onClick={() => void updateIdea(idea.id, { color: c })}
              style={{ background: `var(--idea-${c}-bg)` }}
              className="size-7 rounded-full border-2 border-border aria-pressed:border-accent aria-pressed:ring-2 aria-pressed:ring-accent"
            />
          ))}
        </div>
      </div>

      <label className="flex flex-col gap-1 text-sm text-muted">
        {t('details.description')}
        <textarea
          defaultValue={idea.description}
          rows={4}
          dir="auto"
          placeholder={t('details.descriptionPlaceholder')}
          onBlur={(e) =>
            e.target.value !== idea.description &&
            void updateIdea(idea.id, { description: e.target.value })
          }
          className={field}
        />
      </label>

      <section className="flex flex-col gap-3" aria-labelledby="notes-title">
        <h3 id="notes-title" className="text-sm font-semibold text-muted">
          {t('details.notes')} {notes && notes.length > 0 ? `(${notes.length})` : ''}
        </h3>
        <textarea
          value={draft}
          rows={3}
          dir="auto"
          placeholder={t('details.notePlaceholder')}
          aria-label={t('details.notePlaceholder')}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) void submitNote();
          }}
          className={field}
        />
        <Button
          variant="primary"
          onClick={() => void submitNote()}
          disabled={!draft.trim()}
          data-testid="add-note"
        >
          <PlusIcon />
          {t('details.addNote')}
        </Button>
        {notes?.length === 0 && <p className="text-sm text-muted">{t('details.noNotes')}</p>}
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {notes?.map((note) => (
            <li
              key={note.id}
              data-testid="note"
              className="rounded-xl border border-border bg-bg p-3"
            >
              <textarea
                defaultValue={note.text}
                rows={2}
                dir="auto"
                aria-label={t('details.notes')}
                onBlur={(e) => {
                  const text = e.target.value.trim();
                  if (text && text !== note.text) void updateNote(note.id, text);
                }}
                className="w-full resize-y bg-transparent text-sm outline-none"
              />
              <div className="mt-1 flex items-center justify-between text-xs text-muted">
                <time>
                  {new Date(note.createdAt).toLocaleString(i18n.language, {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </time>
                <button
                  type="button"
                  onClick={() => void removeNote(note.id)}
                  aria-label={t('details.deleteNote')}
                  title={t('details.deleteNote')}
                  className="rounded p-1 hover:text-accent focus-visible:outline-2 focus-visible:outline-accent"
                >
                  <TrashIcon width={14} height={14} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}
