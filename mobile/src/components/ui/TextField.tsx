import React from 'react';
import {
  StyleSheet,
  TextInput as RNTextInput,
  TextInputProps,
  View,
} from 'react-native';
import { theme } from '../../theme';
import { Text } from './Text';

type Props = TextInputProps & {
  label: string;
  error?: string;
  hideLabel?: boolean;
};

export function TextField({
  label,
  error,
  hideLabel = false,
  style,
  ...rest
}: Props) {
  return (
    <View style={styles.wrap}>
      {!hideLabel ? <Text variant="label" style={styles.label}>{label}</Text> : null}
      <RNTextInput
        accessibilityLabel={label}
        placeholderTextColor={theme.colors.textPlaceholder}
        style={[styles.input, error ? styles.inputError : null, style]}
        {...rest}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    marginBottom: theme.spacing[3],
  },
  label: {
    marginBottom: theme.spacing[1.5],
  },
  input: {
    width: '100%',
    backgroundColor: theme.colors.backgroundMuted,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.element,
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[3],
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.base,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  error: {
    color: theme.colors.error,
    fontSize: theme.typography.size.sm,
    marginTop: theme.spacing[1.5],
  },
});
