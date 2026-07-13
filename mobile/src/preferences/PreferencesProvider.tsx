import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n, { DEFAULT_LOCALE, deviceLocale, isValidLocale, AppLocale } from '../i18n';
import { ThemeMode } from '../theme';
import { getStoredToken, updatePreferences } from '../lib/authService';
import { AuthUser } from '../lib/api';

const LOCALE_KEY = 'linguaflow_ui_locale';
const THEME_KEY = 'linguaflow_theme_mode';

export const THEME_MODES: ThemeMode[] = ['light', 'dark', 'system'];
export const DEFAULT_THEME_MODE: ThemeMode = 'system';

function isThemeMode(value: unknown): value is ThemeMode {
  return typeof value === 'string' && THEME_MODES.includes(value as ThemeMode);
}

type PreferencesContextValue = {
  ready: boolean;
  locale: AppLocale;
  themeMode: ThemeMode;
  setLocale: (locale: AppLocale) => Promise<void>;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  applyFromUser: (user: AuthUser) => void;
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [locale, setLocaleState] = useState<AppLocale>(DEFAULT_LOCALE);
  const [themeMode, setThemeModeState] = useState<ThemeMode>(DEFAULT_THEME_MODE);

  useEffect(() => {
    (async () => {
      try {
        const [storedLocale, storedTheme] = await Promise.all([
          AsyncStorage.getItem(LOCALE_KEY),
          AsyncStorage.getItem(THEME_KEY),
        ]);
        const nextLocale = isValidLocale(storedLocale) ? storedLocale : deviceLocale();
        const nextTheme = isThemeMode(storedTheme) ? storedTheme : DEFAULT_THEME_MODE;
        setLocaleState(nextLocale);
        setThemeModeState(nextTheme);
        await i18n.changeLanguage(nextLocale);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
  }, [locale, ready]);

  const persist = useCallback(async (nextLocale: AppLocale, nextTheme: ThemeMode) => {
    setLocaleState(nextLocale);
    setThemeModeState(nextTheme);
    await AsyncStorage.setMany({
      [LOCALE_KEY]: nextLocale,
      [THEME_KEY]: nextTheme,
    });
  }, []);

  const applyFromUser = useCallback((user: AuthUser) => {
    setLocaleState((prevLocale) => {
      const nextLocale = isValidLocale(user.uiLocale) ? user.uiLocale : prevLocale;
      setThemeModeState((prevTheme) => {
        const nextTheme = isThemeMode(user.themeMode) ? user.themeMode : prevTheme;
        void AsyncStorage.setMany({
          [LOCALE_KEY]: nextLocale,
          [THEME_KEY]: nextTheme,
        });
        return nextTheme;
      });
      return nextLocale;
    });
  }, []);

  const setLocale = useCallback(
    async (nextLocale: AppLocale) => {
      if (nextLocale === locale) return;
      await persist(nextLocale, themeMode);
      const token = await getStoredToken();
      if (token) {
        try {
          await updatePreferences({ uiLocale: nextLocale }, token);
        } catch (err) {
          console.error('Failed to sync locale preference:', err);
        }
      }
    },
    [locale, persist, themeMode],
  );

  const setThemeMode = useCallback(
    async (nextTheme: ThemeMode) => {
      if (nextTheme === themeMode) return;
      await persist(locale, nextTheme);
      const token = await getStoredToken();
      if (token) {
        try {
          await updatePreferences({ themeMode: nextTheme }, token);
        } catch (err) {
          console.error('Failed to sync theme preference:', err);
        }
      }
    },
    [locale, persist, themeMode],
  );

  const value = useMemo(
    () => ({
      ready,
      locale,
      themeMode,
      setLocale,
      setThemeMode,
      applyFromUser,
    }),
    [ready, locale, themeMode, setLocale, setThemeMode, applyFromUser],
  );

  return (
    <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) {
    throw new Error('usePreferences must be used within PreferencesProvider');
  }
  return ctx;
}
