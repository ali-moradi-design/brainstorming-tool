import { BackupMenu } from '@/features/data-backup';
import { LanguageSwitch } from '@/features/language-switch';
import { ThemeSwitch } from '@/features/theme-switch';

/** Floating controls in the top corner of the workspace. */
export function TopControls() {
  return (
    <div className="absolute end-4 top-3 z-30 flex items-center gap-2 rounded-2xl border border-border bg-surface/90 p-1.5 shadow-lg backdrop-blur">
      <BackupMenu />
      <LanguageSwitch />
      <ThemeSwitch />
    </div>
  );
}
