import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button, Text } from '../ui';
import { spacing } from '../../theme';
import { useAppTheme } from '../../hooks/useAppTheme';

type Props = {
  onSignOut: () => void;
};

export default function Navbar({ onSignOut }: Props) {
  const { t } = useTranslation();
  const { colors } = useAppTheme();

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: colors.backgroundBody,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <Text variant="label" style={[styles.brand, { color: colors.cyan }]}>
        {t('common.brand')}
      </Text>
      <Button label={t('common.signOut')} variant="secondary" size="sm" onPress={onSignOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    width: '100%',
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[8],
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
    gap: spacing[3],
  },
  brand: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    flexShrink: 1,
  },
});
