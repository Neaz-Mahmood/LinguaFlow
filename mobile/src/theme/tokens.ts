/**
 * Mobile tokens mirrored from @astryxdesign/theme-gothic (v0.1.4).
 * Keep aligned with frontend gothicTheme tokens when updating Astryx.
 */
export const colors = {
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
} as const;

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

export const theme = {
  colors,
  spacing,
  radius,
  typography,
} as const;

export type Theme = typeof theme;
