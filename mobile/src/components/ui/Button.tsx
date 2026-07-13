import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text as RNText,
  ViewStyle,
} from 'react-native';
import { theme } from '../../theme';

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
  const disabled = isDisabled || isLoading;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        sizeStyles[size],
        variantStyles[variant],
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator
          color={variant === 'primary' ? theme.colors.onAccent : theme.colors.textPrimary}
        />
      ) : (
        <RNText style={[styles.label, labelStyles[variant], sizeLabelStyles[size]]}>
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
    borderRadius: theme.radius.element,
    borderWidth: 1,
  },
  pressed: {
    opacity: 0.88,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontWeight: theme.typography.weight.semibold,
  },
});

const sizeStyles = StyleSheet.create({
  sm: {
    paddingVertical: theme.spacing[2],
    paddingHorizontal: theme.spacing[3],
    minHeight: 36,
  },
  md: {
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[5],
    minHeight: 44,
  },
  lg: {
    paddingVertical: theme.spacing[4],
    paddingHorizontal: theme.spacing[6],
    minHeight: 52,
  },
});

const sizeLabelStyles = StyleSheet.create({
  sm: { fontSize: theme.typography.size.sm },
  md: { fontSize: theme.typography.size.base },
  lg: { fontSize: theme.typography.size.lg },
});

const variantStyles = StyleSheet.create({
  primary: {
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.accent,
  },
  secondary: {
    backgroundColor: theme.colors.backgroundMuted,
    borderColor: theme.colors.border,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  destructive: {
    backgroundColor: theme.colors.error,
    borderColor: theme.colors.error,
  },
});

const labelStyles = StyleSheet.create({
  primary: { color: theme.colors.onAccent },
  secondary: { color: theme.colors.textPrimary },
  ghost: { color: theme.colors.textSecondary },
  destructive: { color: theme.colors.onError },
});
