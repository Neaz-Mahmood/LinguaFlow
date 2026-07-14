/**
 * LinguaFlow brand palette — keep aligned with frontend/src/theme/palette.css
 * https://coolors.co/2ec0f9-67aaf9-9bbdf9-c4e0f9-b95f89
 */
export const palette = {
  sky: '#2ec0f9',
  blue: '#67aaf9',
  softBlue: '#9bbdf9',
  paleBlue: '#c4e0f9',
  mauve: '#b95f89',
  mauveDark: '#9a4d73',
  ink: '#0f1826',
  inkMuted: '#2d4a6e',
} as const;

export type ColorTokens = {
  backgroundBody: string;
  backgroundSurface: string;
  backgroundCard: string;
  backgroundMuted: string;
  backgroundPopover: string;
  backgroundInverted: string;
  textPrimary: string;
  textSecondary: string;
  textDisabled: string;
  textAccent: string;
  textPlaceholder: string;
  accent: string;
  accentMuted: string;
  onAccent: string;
  onDark: string;
  onLight: string;
  border: string;
  borderEmphasized: string;
  success: string;
  onSuccess: string;
  error: string;
  onError: string;
  warning: string;
  onWarning: string;
  cyan: string;
  purple: string;
  overlayHover: string;
  overlayPressed: string;
};

export const darkColors: ColorTokens = {
  backgroundBody: palette.ink,
  backgroundSurface: palette.ink,
  backgroundCard: '#162238',
  backgroundMuted: '#1c2d47',
  backgroundPopover: '#1c2d47',
  backgroundInverted: palette.paleBlue,

  textPrimary: palette.paleBlue,
  textSecondary: palette.softBlue,
  textDisabled: '#5a7a9e',
  textAccent: palette.sky,
  textPlaceholder: '#5a7a9e',

  accent: palette.sky,
  accentMuted: 'rgba(46, 192, 249, 0.18)',
  onAccent: palette.ink,
  onDark: palette.paleBlue,
  onLight: palette.ink,

  border: 'rgba(196, 224, 249, 0.14)',
  borderEmphasized: '#5a7a9e',

  success: '#b3c79a',
  onSuccess: palette.ink,
  error: '#c6a6a2',
  onError: palette.paleBlue,
  warning: '#d3c490',
  onWarning: palette.ink,

  cyan: palette.sky,
  purple: palette.mauve,
  overlayHover: 'rgba(196, 224, 249, 0.06)',
  overlayPressed: 'rgba(196, 224, 249, 0.12)',
};

export const lightColors: ColorTokens = {
  backgroundBody: palette.paleBlue,
  backgroundSurface: palette.paleBlue,
  backgroundCard: '#e3f0fc',
  backgroundMuted: palette.softBlue,
  backgroundPopover: '#FFFFFF',
  backgroundInverted: palette.ink,

  textPrimary: palette.ink,
  textSecondary: palette.inkMuted,
  textDisabled: '#6b8ab5',
  textAccent: palette.sky,
  textPlaceholder: '#6b8ab5',

  accent: palette.sky,
  accentMuted: 'rgba(46, 192, 249, 0.14)',
  onAccent: palette.ink,
  onDark: palette.paleBlue,
  onLight: palette.ink,

  border: 'rgba(15, 24, 38, 0.12)',
  borderEmphasized: '#6b8ab5',

  success: '#5a7048',
  onSuccess: palette.paleBlue,
  error: '#8a5c58',
  onError: palette.paleBlue,
  warning: '#8a7a40',
  onWarning: palette.ink,

  cyan: palette.sky,
  purple: palette.mauve,
  overlayHover: 'rgba(15, 24, 38, 0.04)',
  overlayPressed: 'rgba(15, 24, 38, 0.08)',
};

/** @deprecated Prefer useAppTheme().colors — defaults to dark */
export const colors = darkColors;

/** Astryx spacing scale (4px base): spacing-1 = 4, spacing-2 = 8, … */
export const spacing = {
  0: 0,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
} as const;

export const radius = {
  none: 2,
  inner: 4,
  element: 8,
  container: 12,
  page: 24,
  full: 9999,
} as const;

export const typography = {
  fontFamily: {
    body: 'System',
    heading: 'System',
  },
  size: {
    xs: 10,
    sm: 13,
    base: 16,
    lg: 20,
    xl: 25,
    '2xl': 31,
    '3xl': 39,
  },
  weight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

export function getColorsForScheme(scheme: 'light' | 'dark'): ColorTokens {
  return scheme === 'light' ? lightColors : darkColors;
}

export const theme = {
  colors: darkColors,
  spacing,
  radius,
  typography,
} as const;

export type Theme = {
  colors: ColorTokens;
  spacing: typeof spacing;
  radius: typeof radius;
  typography: typeof typography;
};
