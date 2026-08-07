/**
 * LinguaFlow Soft-Tech EdTech brand palette (from frontend/DESIGN.md)
 */
export const palette = {
  deepNavy: '#1C2B33',
  primary: '#07161e',
  primaryContainer: '#1c2b33',
  subtleGray: '#65676B',
  secondary: '#5c5e62',
  backgroundFaint: '#F0F2F5',
  surfaceWhite: '#FFFFFF',
  surface: '#f7f9fc',
  onSurface: '#191c1e',
  onSurfaceVariant: '#43474a',
  outlineVariant: '#c3c7ca',
  outline: '#73787b',
  error: '#ba1a1a',
  onError: '#ffffff',
  tertiaryContainer: '#372516',
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

export const lightColors: ColorTokens = {
  backgroundBody: palette.backgroundFaint,
  backgroundSurface: palette.surfaceWhite,
  backgroundCard: palette.surfaceWhite,
  backgroundMuted: '#f2f4f7',
  backgroundPopover: palette.surfaceWhite,
  backgroundInverted: palette.primary,

  textPrimary: palette.onSurface,
  textSecondary: palette.onSurfaceVariant,
  textDisabled: palette.outline,
  textAccent: palette.deepNavy,
  textPlaceholder: palette.subtleGray,

  accent: palette.deepNavy,
  accentMuted: 'rgba(28, 43, 51, 0.12)',
  onAccent: '#FFFFFF',
  onDark: palette.surfaceWhite,
  onLight: palette.onSurface,

  border: palette.outlineVariant,
  borderEmphasized: palette.subtleGray,

  success: '#5a7048',
  onSuccess: palette.surfaceWhite,
  error: palette.error,
  onError: palette.onError,
  warning: '#8a7a40',
  onWarning: palette.onSurface,

  cyan: palette.deepNavy,
  purple: palette.tertiaryContainer,
  overlayHover: 'rgba(25, 28, 30, 0.04)',
  overlayPressed: 'rgba(25, 28, 30, 0.08)',
};

export const darkColors: ColorTokens = {
  backgroundBody: palette.primary,
  backgroundSurface: palette.primaryContainer,
  backgroundCard: palette.primaryContainer,
  backgroundMuted: '#2d3133',
  backgroundPopover: palette.primaryContainer,
  backgroundInverted: palette.surfaceWhite,

  textPrimary: '#eff1f4',
  textSecondary: '#83929c',
  textDisabled: palette.outline,
  textAccent: '#b9c9d3',
  textPlaceholder: palette.outline,

  accent: '#b9c9d3',
  accentMuted: 'rgba(185, 201, 211, 0.18)',
  onAccent: palette.primary,
  onDark: '#eff1f4',
  onLight: palette.primary,

  border: palette.outline,
  borderEmphasized: palette.outlineVariant,

  success: '#b3c79a',
  onSuccess: palette.primary,
  error: '#ffdad6',
  onError: '#93000a',
  warning: '#d3c490',
  onWarning: palette.primary,

  cyan: '#b9c9d3',
  purple: palette.tertiaryContainer,
  overlayHover: 'rgba(239, 241, 244, 0.06)',
  overlayPressed: 'rgba(239, 241, 244, 0.12)',
};

/** Default colors preset — defaults to light mode for Soft-Tech EdTech */
export const colors = lightColors;

/** Spacing scale (4px base): space-xs = 4, space-sm = 8, space-md = 16, space-lg = 24, space-xl = 32, space-2xl = 48, space-3xl = 64 */
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
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
} as const;

export const radius = {
  none: 0,
  sm: 4,
  inner: 4,
  DEFAULT: 8,
  element: 8,
  md: 12,
  container: 16,
  lg: 16,
  xl: 24,
  page: 24,
  full: 9999,
} as const;

export const typography = {
  fontFamily: {
    heading: 'Hanken Grotesk',
    body: 'Be Vietnam Pro',
    mono: 'JetBrains Mono',
  },
  presets: {
    displayLg: {
      fontFamily: 'Hanken Grotesk',
      fontSize: 48,
      fontWeight: '700' as const,
      lineHeight: 56,
      letterSpacing: -0.96,
    },
    headlineLg: {
      fontFamily: 'Hanken Grotesk',
      fontSize: 32,
      fontWeight: '600' as const,
      lineHeight: 40,
    },
    headlineLgMobile: {
      fontFamily: 'Hanken Grotesk',
      fontSize: 24,
      fontWeight: '600' as const,
      lineHeight: 32,
    },
    titleMd: {
      fontFamily: 'Hanken Grotesk',
      fontSize: 20,
      fontWeight: '500' as const,
      lineHeight: 28,
    },
    bodyLg: {
      fontFamily: 'Be Vietnam Pro',
      fontSize: 18,
      fontWeight: '400' as const,
      lineHeight: 28,
    },
    bodyMd: {
      fontFamily: 'Be Vietnam Pro',
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 24,
    },
    labelMd: {
      fontFamily: 'JetBrains Mono',
      fontSize: 14,
      fontWeight: '500' as const,
      lineHeight: 20,
      letterSpacing: 0.7,
    },
    labelSm: {
      fontFamily: 'JetBrains Mono',
      fontSize: 12,
      fontWeight: '500' as const,
      lineHeight: 16,
      letterSpacing: 0.6,
    },
  },
  size: {
    xs: 10,
    sm: 12,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    '4xl': 48,
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
  colors: lightColors,
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
