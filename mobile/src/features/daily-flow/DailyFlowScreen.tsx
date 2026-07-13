import React from 'react';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button, Card, Screen, Text } from '../../components/ui';
import PreferencesControls from '../preferences/PreferencesControls';
import { spacing } from '../../theme';
import { useAppTheme } from '../../hooks/useAppTheme';
import { AuthUser } from '../../model';

type Props = {
  user: AuthUser;
  onSignOut: () => void;
};

export default function DailyFlowScreen({ user, onSignOut }: Props) {
  const { t } = useTranslation();
  const { colors } = useAppTheme();

  return (
    <Screen style={styles.container}>
      <Text variant="label" style={[styles.brand, { color: colors.cyan }]}>
        {t('common.brand')}
      </Text>
      <Card style={styles.card}>
        <Text variant="title" style={styles.title}>
          {t('mobile.dailyFlow')}
        </Text>
        <Text variant="secondary" style={styles.body}>
          {t('mobile.signedIn', {
            as: user.email ? t('mobile.signedInAs', { email: user.email }) : '',
          })}
          {t('mobile.dailyFlowBody')}
        </Text>
        <PreferencesControls />
        <Button label={t('common.signOut')} variant="secondary" onPress={onSignOut} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  brand: {
    marginBottom: spacing[3],
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  card: {
    width: '100%',
  },
  title: {
    marginBottom: spacing[3],
  },
  body: {
    marginBottom: spacing[6],
  },
});
