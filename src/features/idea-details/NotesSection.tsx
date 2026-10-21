import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { addNote, removeNote, updateNote, useIdeaNotes } from '@/entities/note';
import type { IdeaRecord } from '@/shared/api';
import { recordChange } from '@/shared/lib';
import { Button, PlusIcon, TrashIcon } from '@/shared/ui';
import { fieldClass } from './FieldsSection';

/** Any number of separate notes attached to an idea. */
export function NotesSection({ idea }: { idea: IdeaRecord }) {
  const { t, i18n } = useTranslation();
  const notes = useIdeaNotes(idea.id);
  const [draft, setDraft] = useState('');

  const submit = async () => {
    const text = draft.trim();
    if (!text) return;
    setDraft('');
    await recordChange(idea.boardId);
    await addNote(idea.boardId, idea.id, text);
  };

  return (
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
          if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) void submit();
        }}
        className={fieldClass}
      />
      <Button
        variant="primary"
        onClick={() => void submit()}
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
              onBlur={async (e) => {
                const text = e.target.value.trim();
                if (!text || text === note.text) return;
                await recordChange(idea.boardId);
                await updateNote(note.id, text);
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
                onClick={async () => {
                  await recordChange(idea.boardId);
                  await removeNote(note.id);
                }}
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
  );
}
