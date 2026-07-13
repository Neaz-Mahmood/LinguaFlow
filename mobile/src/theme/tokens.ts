/**
 * Mobile tokens mirrored from @astryxdesign/theme-gothic (v0.1.4).
 * Keep aligned with frontend gothicTheme tokens when updating Astryx.
 */

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
  backgroundBody: '#101314',
  backgroundSurface: '#101314',
  backgroundCard: '#1a1d20',
  backgroundMuted: '#24292D',
  backgroundPopover: '#24292D',
  backgroundInverted: '#E8F1F6',

  textPrimary: '#E8F1F6',
  textSecondary: '#96A0AB',
  textDisabled: '#495056',
  textAccent: '#E8F1F6',
  textPlaceholder: '#495056',

  accent: '#E8F1F6',
  accentMuted: 'rgba(232, 241, 246, 0.12)',
  onAccent: '#101314',
  onDark: '#E8F1F6',
  onLight: '#101314',

  border: 'rgba(232, 241, 246, 0.1)',
  borderEmphasized: '#495056',

  success: '#b3c79a',
  onSuccess: '#101314',
  error: '#c6a6a2',
  onError: '#101314',
  warning: '#d3c490',
  onWarning: '#101314',

  cyan: '#a3c2cf',
  purple: '#b29bc4',
  overlayHover: 'rgba(232, 241, 246, 0.05)',
  overlayPressed: 'rgba(232, 241, 246, 0.1)',
};

export const lightColors: ColorTokens = {
  backgroundBody: '#E8F1F6',
  backgroundSurface: '#E8F1F6',
  backgroundCard: '#F5F9FC',
  backgroundMuted: '#D5E2EA',
  backgroundPopover: '#FFFFFF',
  backgroundInverted: '#101314',

  textPrimary: '#101314',
  textSecondary: '#495056',
  textDisabled: '#96A0AB',
  textAccent: '#101314',
  textPlaceholder: '#96A0AB',

  accent: '#101314',
  accentMuted: 'rgba(16, 19, 20, 0.08)',
  onAccent: '#E8F1F6',
  onDark: '#E8F1F6',
  onLight: '#101314',

  border: 'rgba(16, 19, 20, 0.12)',
  borderEmphasized: '#96A0AB',

  success: '#5a7048',
  onSuccess: '#E8F1F6',
  error: '#8a5c58',
  onError: '#E8F1F6',
  warning: '#8a7a40',
  onWarning: '#E8F1F6',

  cyan: '#3d6a7a',
  purple: '#6a5280',
  overlayHover: 'rgba(16, 19, 20, 0.04)',
  overlayPressed: 'rgba(16, 19, 20, 0.08)',
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
