import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { isSameIdea, removeIdeaTree } from '@/entities/idea';
import type { IdeaRecord } from '@/shared/api';
import { recordChange } from '@/shared/lib';
import { Button, TrashIcon } from '@/shared/ui';
import { ColorField, DescriptionField, TitleField } from './FieldsSection';
import { LinksSection } from './LinksSection';
import { NotesSection } from './NotesSection';
import { TagsSection } from './TagsSection';

type Props = { idea: IdeaRecord; onClose: () => void };

/**
 * Bottom sheet with three columns: title/description/tags, notes, and color/links/delete.
 * It sits below the canvas (the canvas shrinks) so it never covers the map or its toolbar.
 */
export const IdeaDetailsPanel = memo(
  function IdeaDetailsPanel({ idea, onClose }: Props) {
    const { t } = useTranslation();

    const remove = async () => {
      await recordChange(idea.boardId);
      await removeIdeaTree(idea.boardId, idea.id);
      onClose();
    };

    return (
      <aside
        aria-label={t('details.title')}
        data-testid="details-panel"
        className="relative z-20 grid max-h-[55vh] shrink-0 gap-6 overflow-y-auto border-t border-border bg-surface px-6 pb-5 pt-6 shadow-[0_-10px_40px_rgba(0,0,0,0.25)] md:h-80 md:grid-cols-[1.1fr_1.3fr_0.8fr]"
      >
        <span
          aria-hidden
          className="absolute start-1/2 top-2 h-1.5 w-12 -translate-x-1/2 rounded-full bg-border"
        />
        <Button
          onClick={onClose}
          aria-label={t('details.close')}
          title={t('details.close')}
          className="absolute end-4 top-3 z-10 h-8 w-8 px-0"
        >
          ✕
        </Button>
        <div className="flex min-h-0 flex-col gap-3">
          <TitleField idea={idea} />
          <DescriptionField idea={idea} />
          <TagsSection idea={idea} />
        </div>
        <div className="min-h-0 md:overflow-y-auto md:pe-1">
          <NotesSection idea={idea} />
        </div>
        <div className="flex min-h-0 flex-col gap-4 md:overflow-y-auto md:pe-1">
          <ColorField idea={idea} />
          <LinksSection idea={idea} />
          {idea.parentId !== null && (
            <Button
              variant="danger"
              onClick={() => void remove()}
              className="mt-auto"
              data-testid="delete-idea"
            >
              <TrashIcon />
              {t('details.delete')}
            </Button>
          )}
        </div>
      </aside>
    );
  },
  // Every change on the board reloads all ideas; re-render only when this idea's values change.
  (a, b) => a.onClose === b.onClose && isSameIdea(a.idea, b.idea),
);
