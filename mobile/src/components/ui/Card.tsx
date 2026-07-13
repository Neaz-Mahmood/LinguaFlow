import React from 'react';
import { StyleSheet, View, ViewProps, ViewStyle } from 'react-native';
import { spacing, radius, useAppTheme } from '../../theme';

type Props = ViewProps & {
  children: React.ReactNode;
  padded?: boolean;
  style?: ViewStyle;
};

export function Card({ children, padded = true, style, ...rest }: Props) {
  const { colors } = useAppTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.backgroundCard,
          borderColor: colors.border,
        },
        padded && styles.padded,
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

export function Screen({ children, style, ...rest }: Props) {
  const { colors } = useAppTheme();

  return (
    <View
      style={[
        styles.screen,
        { backgroundColor: colors.backgroundBody },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: spacing[6] + spacing[1],
    paddingVertical: spacing[8],
  },
  card: {
    borderWidth: 1,
    borderRadius: radius.container,
  },
  padded: {
    padding: spacing[6],
  },
});
