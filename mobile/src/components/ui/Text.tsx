import React from 'react';
import { StyleSheet, Text as RNText, TextProps, TextStyle } from 'react-native';
import { theme } from '../../theme';

type Variant = 'title' | 'heading' | 'body' | 'secondary' | 'label' | 'brand';

type Props = TextProps & {
  variant?: Variant;
  children: React.ReactNode;
};

export function Text({ variant = 'body', style, children, ...rest }: Props) {
  return (
    <RNText style={[styles.base, variantStyles[variant], style]} {...rest}>
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  base: {
    color: theme.colors.textPrimary,
  },
});

const variantStyles = StyleSheet.create({
  brand: {
    fontSize: theme.typography.size['3xl'],
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.textPrimary,
    letterSpacing: -0.5,
  },
  title: {
    fontSize: theme.typography.size['2xl'],
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.textPrimary,
  },
  heading: {
    fontSize: theme.typography.size.xl,
    fontWeight: theme.typography.weight.semibold,
    color: theme.colors.textPrimary,
  },
  body: {
    fontSize: theme.typography.size.base,
    fontWeight: theme.typography.weight.normal,
    color: theme.colors.textPrimary,
    lineHeight: 24,
  },
  secondary: {
    fontSize: theme.typography.size.base,
    fontWeight: theme.typography.weight.normal,
    color: theme.colors.textSecondary,
    lineHeight: 24,
  },
  label: {
    fontSize: theme.typography.size.sm,
    fontWeight: theme.typography.weight.medium,
    color: theme.colors.textSecondary,
  },
});
