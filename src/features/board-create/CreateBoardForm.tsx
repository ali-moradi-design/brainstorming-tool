import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, PlusIcon } from '@/shared/ui';
import { createBoard } from './createBoard';
import { TEMPLATE_KEYS, type TemplateBranch, type TemplateKey } from './templates';

type Props = { onCreated: (id: string) => void; compact?: boolean };

export function CreateBoardForm({ onCreated, compact = false }: Props) {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [template, setTemplate] = useState<TemplateKey>('blank');

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const clean = title.trim();
    if (!clean) return;
    const branches = t(`templates.${template}.branches`, {
      returnObjects: true,
    }) as TemplateBranch[];
    setTitle('');
    onCreated(await createBoard(clean, Array.isArray(branches) ? branches : []));
  };

  const control =
    'rounded-xl border border-border bg-surface px-4 text-text placeholder:text-muted focus-visible:outline-2 focus-visible:outline-accent';
  const height = compact ? 'h-10 text-sm' : 'h-11';

  return (
    <form onSubmit={submit} className={`flex gap-2 ${compact ? 'flex-col' : 'flex-wrap'}`}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={t('boards.createPlaceholder')}
        aria-label={t('boards.createPlaceholder')}
        maxLength={80}
        className={`min-w-0 ${compact ? 'shrink-0' : 'flex-1'} ${height} ${control}`}
      />
      <select
        value={template}
        onChange={(e) => setTemplate(e.target.value as TemplateKey)}
        aria-label={t('boards.template')}
        data-testid="template-select"
        className={`${height} ${control}`}
      >
        {TEMPLATE_KEYS.map((key) => (
          <option key={key} value={key}>
            {t(`templates.${key}.name`)}
          </option>
        ))}
      </select>
      <Button
        type="submit"
        variant="primary"
        className={compact ? 'h-10' : 'h-11 px-5'}
        disabled={!title.trim()}
      >
        <PlusIcon />
        {t('boards.create')}
      </Button>
    </form>
  );
}
