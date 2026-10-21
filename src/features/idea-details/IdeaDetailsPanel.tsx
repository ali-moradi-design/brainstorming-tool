import { useTranslation } from 'react-i18next';
import type { IdeaRecord } from '@/shared/api';
import { Button } from '@/shared/ui';
import { FieldsSection } from './FieldsSection';
import { LinksSection } from './LinksSection';
import { NotesSection } from './NotesSection';
import { TagsSection } from './TagsSection';

type Props = { idea: IdeaRecord; onClose: () => void };

/** Side drawer composing the detail sections (fields, tags, links, notes) for one idea. */
export function IdeaDetailsPanel({ idea, onClose }: Props) {
  const { t } = useTranslation();
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
      <FieldsSection idea={idea} />
      <TagsSection idea={idea} />
      <LinksSection idea={idea} />
      <NotesSection idea={idea} />
    </aside>
  );
}
