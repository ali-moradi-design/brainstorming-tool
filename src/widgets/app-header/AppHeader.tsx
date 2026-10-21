import { useTranslation } from 'react-i18next';
import { BackupMenu } from '@/features/data-backup';
import { LanguageSwitch } from '@/features/language-switch';
import { ThemeSwitch } from '@/features/theme-switch';
import { LogoIcon } from '@/shared/ui';

export function AppHeader() {
  const { t } = useTranslation();
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-3 border-b border-border bg-bg/90 px-4 backdrop-blur">
      <a href="#/" className="flex items-center gap-2 text-lg font-bold text-text no-underline">
        <LogoIcon className="text-accent" width={24} height={24} />
        {t('app.title')}
      </a>
      <div className="flex items-center gap-2">
        <BackupMenu />
        <LanguageSwitch />
        <ThemeSwitch />
      </div>
    </header>
  );
}
