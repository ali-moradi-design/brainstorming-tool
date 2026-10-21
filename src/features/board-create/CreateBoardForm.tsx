import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, PlusIcon } from '@/shared/ui';
import { createBoard } from './createBoard';

export function CreateBoardForm({ onCreated }: { onCreated: (id: string) => void }) {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const clean = title.trim();
    if (!clean) return;
    setTitle('');
    onCreated(await createBoard(clean));
  };

  return (
    <form onSubmit={submit} className="flex gap-2">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={t('boards.createPlaceholder')}
        aria-label={t('boards.createPlaceholder')}
        maxLength={80}
        className="h-11 min-w-0 flex-1 rounded-xl border border-border bg-surface px-4 text-text placeholder:text-muted focus-visible:outline-2 focus-visible:outline-accent"
      />
      <Button type="submit" variant="primary" className="h-11 px-5" disabled={!title.trim()}>
        <PlusIcon />
        {t('boards.create')}
      </Button>
    </form>
  );
}
