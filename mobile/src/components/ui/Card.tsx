import React from 'react';
import { StyleSheet, View, ViewProps, ViewStyle } from 'react-native';
import { theme } from '../../theme';

type Props = ViewProps & {
  children: React.ReactNode;
  padded?: boolean;
  style?: ViewStyle;
};

export function Card({ children, padded = true, style, ...rest }: Props) {
  return (
    <View style={[styles.card, padded && styles.padded, style]} {...rest}>
      {children}
    </View>
  );
}

export function Screen({ children, style, ...rest }: Props) {
  return (
    <View style={[styles.screen, style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.backgroundBody,
    paddingHorizontal: theme.spacing[6] + theme.spacing[1],
    paddingVertical: theme.spacing[8],
  },
  card: {
    backgroundColor: theme.colors.backgroundCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.container,
  },
  padded: {
    padding: theme.spacing[6],
  },
});
