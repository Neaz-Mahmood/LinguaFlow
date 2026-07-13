import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import type { AppLocale } from '../model';
import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import de from './locales/de.json';

export type { AppLocale } from '../model';
export const LOCALES: readonly AppLocale[] = ['en', 'es', 'fr', 'de'];
export const DEFAULT_LOCALE: AppLocale = 'en';

export function isValidLocale(value: unknown): value is AppLocale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}

export function deviceLocale(): AppLocale {
  const code = Localization.getLocales()[0]?.languageCode ?? DEFAULT_LOCALE;
  return isValidLocale(code) ? code : DEFAULT_LOCALE;
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es },
    fr: { translation: fr },
    de: { translation: de },
  },
  lng: DEFAULT_LOCALE,
  fallbackLng: DEFAULT_LOCALE,
  interpolation: { escapeValue: false },
  compatibilityJSON: 'v4',
});

export default i18n;
