import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import es from './locales/es.json';
import fa from './locales/fa.json';
import { LANG_STORAGE_KEY, LANGUAGES, isLanguage, type LanguageCode } from './languages';

const readStoredLanguage = (): LanguageCode => {
  try {
    const stored = localStorage.getItem(LANG_STORAGE_KEY);
    if (isLanguage(stored)) return stored;
    const browser = navigator.language.slice(0, 2);
    if (isLanguage(browser)) return browser;
  } catch {
    /* storage unavailable */
  }
  return 'en';
};

/** Sets the UI language, persists it and updates `<html lang dir>`. */
export const applyLanguage = async (code: LanguageCode): Promise<void> => {
  await i18n.changeLanguage(code);
  const root = document.documentElement;
  root.lang = code;
  root.dir = LANGUAGES.find((l) => l.code === code)?.dir ?? 'ltr';
  try {
    localStorage.setItem(LANG_STORAGE_KEY, code);
  } catch {
    /* storage unavailable */
  }
};

export const initI18n = async (): Promise<void> => {
  await i18n.use(initReactI18next).init({
    resources: { en: { translation: en }, es: { translation: es }, fa: { translation: fa } },
    lng: readStoredLanguage(),
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });
  await applyLanguage(i18n.language as LanguageCode);
};

export { i18n };
