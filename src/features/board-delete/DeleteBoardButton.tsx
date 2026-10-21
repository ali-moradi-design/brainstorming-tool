import { useTranslation } from 'react-i18next';
import { Button, TrashIcon } from '@/shared/ui';
import { deleteBoard } from './deleteBoard';

export function DeleteBoardButton({ boardId }: { boardId: string }) {
  const { t } = useTranslation();
  return (
    <Button
      variant="danger"
      className="w-9 px-0"
      aria-label={t('boards.delete')}
      title={t('boards.delete')}
      onClick={() => window.confirm(t('boards.deleteConfirm')) && void deleteBoard(boardId)}
    >
      <TrashIcon />
    </Button>
  );
}
