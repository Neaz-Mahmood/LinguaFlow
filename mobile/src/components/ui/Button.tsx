import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text as RNText,
  ViewStyle,
} from 'react-native';
import { spacing, radius, typography, useAppTheme } from '../../theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive';
type Size = 'sm' | 'md' | 'lg';

type Props = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  isDisabled?: boolean;
  isLoading?: boolean;
  style?: ViewStyle;
};

export function Button({
  label,
  onPress,
  variant = 'secondary',
  size = 'md',
  isDisabled = false,
  isLoading = false,
  style,
}: Props) {
  const { colors } = useAppTheme();
  const disabled = isDisabled || isLoading;

  const variantStyle = {
    primary: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    secondary: {
      backgroundColor: colors.backgroundMuted,
      borderColor: colors.border,
    },
    ghost: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
    },
    destructive: {
      backgroundColor: colors.error,
      borderColor: colors.error,
    },
  }[variant];

  const labelColor = {
    primary: colors.onAccent,
    secondary: colors.textPrimary,
    ghost: colors.textSecondary,
    destructive: colors.onError,
  }[variant];

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        sizeStyles[size],
        variantStyle,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator
          color={variant === 'primary' ? colors.onAccent : colors.textPrimary}
        />
      ) : (
        <RNText
          style={[styles.label, { color: labelColor }, sizeLabelStyles[size]]}
        >
          {label}
        </RNText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.element,
    borderWidth: 1,
  },
  pressed: {
    opacity: 0.88,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontWeight: typography.weight.semibold,
  },
});

const sizeStyles = StyleSheet.create({
  sm: {
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    minHeight: 36,
  },
  md: {
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[5],
    minHeight: 44,
  },
  lg: {
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[6],
    minHeight: 52,
  },
});

const sizeLabelStyles = StyleSheet.create({
  sm: { fontSize: typography.size.sm },
  md: { fontSize: typography.size.base },
  lg: { fontSize: typography.size.lg },
});
