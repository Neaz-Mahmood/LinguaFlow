import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text } from '../ui';
import { spacing } from '../../theme';
import { useAppTheme } from '../../hooks/useAppTheme';

export default function Footer() {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const year = new Date().getFullYear();

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: colors.backgroundBody,
          borderTopColor: colors.border,
        },
      ]}
    >
      <Text variant="secondary" style={styles.text}>
        {t('common.brand')}
      </Text>
      <Text variant="secondary" style={styles.text}>
        {t('layout.copyright', { year })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[8],
    paddingVertical: spacing[3],
    borderTopWidth: 1,
    gap: spacing[3],
    flexWrap: 'wrap',
  },
  text: {
    fontSize: 12,
  },
});
