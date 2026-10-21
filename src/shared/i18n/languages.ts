export const LANGUAGES = [
  { code: 'en', label: 'English', dir: 'ltr' },
  { code: 'es', label: 'Español', dir: 'ltr' },
  { code: 'fa', label: 'فارسی', dir: 'rtl' },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]['code'];

export const LANG_STORAGE_KEY = 'bt:lang';

export const isLanguage = (value: unknown): value is LanguageCode =>
  LANGUAGES.some((l) => l.code === value);
