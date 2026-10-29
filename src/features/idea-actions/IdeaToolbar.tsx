import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { IDEA_COLORS } from '@/entities/idea';
import { BranchIcon, Button, LayoutIcon, LinkIcon, PlusIcon, TrashIcon } from '@/shared/ui';

type Props = {
  selectedId: string | null;
  selectedColor: number;
  canDelete: boolean;
  linkMode: boolean;
  onAddChild: () => unknown;
  onAddSibling: () => unknown;
  onColor: (color: number) => unknown;
  onToggleLink: () => unknown;
  onDelete: () => unknown;
  onTidy: () => unknown;
};

/** Memoized: pass stable handlers so dragging on the canvas does not re-render the toolbar. */
export const IdeaToolbar = memo(function IdeaToolbar(p: Props) {
  const { t } = useTranslation();
  const hasSelection = p.selectedId !== null;

  return (
    <div
      role="toolbar"
      className="flex items-center gap-1.5 rounded-2xl border border-border bg-surface p-1.5 shadow-lg"
    >
      <Button
        onClick={p.onAddChild}
        disabled={!hasSelection}
        title={t('idea.addChild')}
        aria-label={t('idea.addChild')}
        data-testid="add-child"
      >
        <BranchIcon />
      </Button>
      <Button
        onClick={p.onAddSibling}
        disabled={!hasSelection}
        title={t('idea.addSibling')}
        aria-label={t('idea.addSibling')}
      >
        <PlusIcon />
      </Button>
      <Button
        variant={p.linkMode ? 'primary' : 'ghost'}
        onClick={p.onToggleLink}
        disabled={!hasSelection}
        aria-pressed={p.linkMode}
        title={t('idea.link')}
        aria-label={t('idea.link')}
        data-testid="link-mode"
      >
        <LinkIcon />
      </Button>
      <div className="mx-1 flex items-center gap-1" role="group">
        {IDEA_COLORS.map((c) => (
          <button
            key={c}
            type="button"
            disabled={!hasSelection}
            aria-label={t('idea.color', { n: c + 1 })}
            aria-pressed={hasSelection && p.selectedColor === c}
            onClick={() => p.onColor(c)}
            style={{ background: `var(--idea-${c}-bg)` }}
            className="size-5 rounded-full border-2 border-border disabled:opacity-40 aria-pressed:border-accent aria-pressed:ring-2 aria-pressed:ring-accent"
          />
        ))}
      </div>
      <Button
        variant="danger"
        onClick={p.onDelete}
        disabled={!hasSelection || !p.canDelete}
        title={t('idea.delete')}
        aria-label={t('idea.delete')}
      >
        <TrashIcon />
      </Button>
      <Button onClick={p.onTidy} title={t('idea.tidy')} aria-label={t('idea.tidy')}>
        <LayoutIcon />
      </Button>
    </div>
  );
});
