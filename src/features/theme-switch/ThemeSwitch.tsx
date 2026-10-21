import { useTranslation } from 'react-i18next';
import { Button, MoonIcon, SunIcon } from '@/shared/ui';
import { useThemeStore } from './store';

export function ThemeSwitch() {
  const { t } = useTranslation();
  const { theme, toggle } = useThemeStore();
  const label = theme === 'dark' ? t('theme.toLight') : t('theme.toDark');

  return (
    <Button
      onClick={toggle}
      aria-label={label}
      title={label}
      data-testid="theme-switch"
      className="w-9 px-0"
    >
      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
    </Button>
  );
}
