import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import i18n, { DEFAULT_LOCALE, isValidLocale } from '../i18n';
import { getToken, updatePreferences } from '../lib/api';

const LOCALE_KEY = 'linguaflow_ui_locale';
const THEME_KEY = 'linguaflow_theme_mode';

export const THEME_MODES = ['light', 'dark', 'system'];
export const DEFAULT_THEME_MODE = 'system';

function readStoredLocale() {
  try {
    const value = localStorage.getItem(LOCALE_KEY);
    return isValidLocale(value) ? value : DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
}

function readStoredThemeMode() {
  try {
    const value = localStorage.getItem(THEME_KEY);
    return THEME_MODES.includes(value) ? value : DEFAULT_THEME_MODE;
  } catch {
    return DEFAULT_THEME_MODE;
  }
}

function writeStored(locale, themeMode) {
  try {
    localStorage.setItem(LOCALE_KEY, locale);
    localStorage.setItem(THEME_KEY, themeMode);
  } catch {
    // ignore quota / private mode
  }
}

const PreferencesContext = createContext(null);

export function PreferencesProvider({ children }) {
  const [locale, setLocaleState] = useState(readStoredLocale);
  const [themeMode, setThemeModeState] = useState(readStoredThemeMode);

  useEffect(() => {
    if (i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
    document.documentElement.lang = locale;
  }, [locale]);

  // Keep <html data-theme> in sync so light-token CSS overrides apply immediately.
  // Gothic is dark-only; Astryx mode alone only flips color-scheme.
  useEffect(() => {
    if (themeMode === 'light' || themeMode === 'dark') {
      document.documentElement.setAttribute('data-theme', themeMode);
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [themeMode]);

  const applyLocal = useCallback((nextLocale, nextTheme) => {
    setLocaleState(nextLocale);
    setThemeModeState(nextTheme);
    writeStored(nextLocale, nextTheme);
  }, []);

  const applyFromUser = useCallback(
    (user) => {
      if (!user) return;
      const nextLocale = isValidLocale(user.uiLocale) ? user.uiLocale : readStoredLocale();
      const nextTheme = THEME_MODES.includes(user.themeMode)
        ? user.themeMode
        : readStoredThemeMode();
      applyLocal(nextLocale, nextTheme);
    },
    [applyLocal],
  );

  const setLocale = useCallback(
    async (nextLocale) => {
      if (!isValidLocale(nextLocale) || nextLocale === locale) return;
      applyLocal(nextLocale, themeMode);
      if (getToken()) {
        try {
          await updatePreferences({ uiLocale: nextLocale });
        } catch (err) {
          console.error('Failed to sync locale preference:', err);
        }
      }
    },
    [applyLocal, locale, themeMode],
  );

  const setThemeMode = useCallback(
    async (nextTheme) => {
      if (!THEME_MODES.includes(nextTheme) || nextTheme === themeMode) return;
      applyLocal(locale, nextTheme);
      if (getToken()) {
        try {
          await updatePreferences({ themeMode: nextTheme });
        } catch (err) {
          console.error('Failed to sync theme preference:', err);
        }
      }
    },
    [applyLocal, locale, themeMode],
  );

  const value = useMemo(
    () => ({
      locale,
      themeMode,
      setLocale,
      setThemeMode,
      applyFromUser,
    }),
    [locale, themeMode, setLocale, setThemeMode, applyFromUser],
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) {
    throw new Error('usePreferences must be used within PreferencesProvider');
  }
  return ctx;
}
