import React from 'react';
import {
  StyleSheet,
  TextInput as RNTextInput,
  TextInputProps,
  View,
} from 'react-native';
import { spacing, radius, typography, useAppTheme } from '../../theme';
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
  const { colors } = useAppTheme();

  return (
    <View style={styles.wrap}>
      {!hideLabel ? <Text variant="label" style={styles.label}>{label}</Text> : null}
      <RNTextInput
        accessibilityLabel={label}
        placeholderTextColor={colors.textPlaceholder}
        style={[
          styles.input,
          {
            backgroundColor: colors.backgroundMuted,
            borderColor: error ? colors.error : colors.border,
            color: colors.textPrimary,
          },
          style,
        ]}
        {...rest}
      />
      {error ? (
        <Text style={[styles.error, { color: colors.error }]}>{error}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    marginBottom: spacing[3],
  },
  label: {
    marginBottom: spacing[1.5],
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderRadius: radius.element,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    fontSize: typography.size.base,
  },
  error: {
    fontSize: typography.size.sm,
    marginTop: spacing[1.5],
  },
});
