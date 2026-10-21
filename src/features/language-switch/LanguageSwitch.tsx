import { useTranslation } from 'react-i18next';
import { applyLanguage, isLanguage, LANGUAGES } from '@/shared/i18n';

export function LanguageSwitch() {
  const { t, i18n } = useTranslation();

  return (
    <select
      aria-label={t('language.label')}
      value={i18n.language}
      onChange={(e) => isLanguage(e.target.value) && void applyLanguage(e.target.value)}
      data-testid="language-switch"
      className="h-9 rounded-lg border border-border bg-surface px-2 text-sm text-text focus-visible:outline-2 focus-visible:outline-accent"
    >
      {LANGUAGES.map((l) => (
        <option key={l.code} value={l.code}>
          {l.label}
        </option>
      ))}
    </select>
  );
}
