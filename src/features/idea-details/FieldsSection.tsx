import { useTranslation } from 'react-i18next';
import { IDEA_COLORS, updateIdea } from '@/entities/idea';
import type { IdeaRecord } from '@/shared/api';
import { recordChange } from '@/shared/lib';

export const fieldClass =
  'w-full resize-y rounded-xl border border-border bg-bg p-3 text-sm text-text placeholder:text-muted focus-visible:outline-2 focus-visible:outline-accent';

const change = async (idea: IdeaRecord, patch: Parameters<typeof updateIdea>[1]) => {
  await recordChange(idea.boardId);
  await updateIdea(idea.id, patch);
};

/** Title, color and description of an idea. */
export function FieldsSection({ idea }: { idea: IdeaRecord }) {
  const { t } = useTranslation();
  return (
    <>
      <label className="flex flex-col gap-1 text-sm text-muted">
        {t('details.text')}
        <input
          defaultValue={idea.text}
          maxLength={120}
          dir="auto"
          onBlur={(e) => {
            const text = e.target.value.trim();
            if (text && text !== idea.text) void change(idea, { text });
          }}
          className={`${fieldClass} h-10 py-0 font-semibold`}
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
              onClick={() => void change(idea, { color: c })}
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
            void change(idea, { description: e.target.value })
          }
          className={fieldClass}
        />
      </label>
    </>
  );
}
