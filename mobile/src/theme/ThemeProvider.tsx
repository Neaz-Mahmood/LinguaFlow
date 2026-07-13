import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import {
  ColorTokens,
  getColorsForScheme,
  radius,
  spacing,
  Theme,
  typography,
} from './tokens';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ColorScheme = 'light' | 'dark';

type ThemeContextValue = Theme & {
  themeMode: ThemeMode;
  colorScheme: ColorScheme;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

type Props = {
  themeMode: ThemeMode;
  children: React.ReactNode;
};

export function ThemeProvider({ themeMode, children }: Props) {
  const systemScheme = useColorScheme();
  const colorScheme: ColorScheme =
    themeMode === 'system'
      ? systemScheme === 'light'
        ? 'light'
        : 'dark'
      : themeMode;

  const value = useMemo<ThemeContextValue>(
    () => ({
      themeMode,
      colorScheme,
      colors: getColorsForScheme(colorScheme),
      spacing,
      radius,
      typography,
    }),
    [themeMode, colorScheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useAppTheme must be used within ThemeProvider');
  }
  return ctx;
}

export type { ColorTokens };
