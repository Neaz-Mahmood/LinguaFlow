import React from 'react';
import { StyleSheet, Text as RNText, TextProps } from 'react-native';
import { typography, useAppTheme } from '../../theme';

type Variant = 'title' | 'heading' | 'body' | 'secondary' | 'label' | 'brand';

type Props = TextProps & {
  variant?: Variant;
  children: React.ReactNode;
};

export function Text({ variant = 'body', style, children, ...rest }: Props) {
  const { colors } = useAppTheme();

  const variantStyle = {
    brand: {
      fontSize: typography.size['3xl'],
      fontWeight: typography.weight.bold,
      color: colors.textPrimary,
      letterSpacing: -0.5,
    },
    title: {
      fontSize: typography.size['2xl'],
      fontWeight: typography.weight.bold,
      color: colors.textPrimary,
    },
    heading: {
      fontSize: typography.size.xl,
      fontWeight: typography.weight.semibold,
      color: colors.textPrimary,
    },
    body: {
      fontSize: typography.size.base,
      fontWeight: typography.weight.normal,
      color: colors.textPrimary,
      lineHeight: 24,
    },
    secondary: {
      fontSize: typography.size.base,
      fontWeight: typography.weight.normal,
      color: colors.textSecondary,
      lineHeight: 24,
    },
    label: {
      fontSize: typography.size.sm,
      fontWeight: typography.weight.medium,
      color: colors.textSecondary,
    },
  }[variant];

  return (
    <RNText style={[styles.base, variantStyle, style]} {...rest}>
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  base: {},
});
