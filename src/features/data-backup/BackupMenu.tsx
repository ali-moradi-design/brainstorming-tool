import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, DownloadIcon, UploadIcon } from '@/shared/ui';
import { exportBackup, importBackup, MAX_BACKUP_BYTES } from './backup';

export function BackupMenu() {
  const { t } = useTranslation();
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);

  const download = async () => {
    const blob = new Blob([JSON.stringify(await exportBackup(), null, 2)], {
      type: 'application/json',
    });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `brainstorm-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const upload = async (file: File | undefined) => {
    if (!file) return;
    try {
      if (file.size > MAX_BACKUP_BYTES) throw new Error('backup too large');
      const count = await importBackup(JSON.parse(await file.text()));
      setMessage(t('backup.importDone', { count }));
    } catch {
      setMessage(t('backup.importError'));
    }
    if (fileRef.current) fileRef.current.value = '';
    setTimeout(() => setMessage(null), 4000);
  };

  return (
    <div className="flex items-center gap-2">
      {message && (
        <span role="status" className="text-sm text-muted">
          {message}
        </span>
      )}
      <Button
        onClick={() => void download()}
        title={t('backup.export')}
        aria-label={t('backup.export')}
      >
        <DownloadIcon />
        <span className="hidden sm:inline">{t('backup.export')}</span>
      </Button>
      <Button
        onClick={() => fileRef.current?.click()}
        title={t('backup.import')}
        aria-label={t('backup.import')}
      >
        <UploadIcon />
        <span className="hidden sm:inline">{t('backup.import')}</span>
      </Button>
      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        hidden
        data-testid="import-input"
        onChange={(e) => void upload(e.target.files?.[0])}
      />
    </div>
  );
}
