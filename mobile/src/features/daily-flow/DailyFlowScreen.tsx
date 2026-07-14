import React from 'react';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Card, Screen, Text } from '../../components/ui';
import PreferencesControls from '../preferences/PreferencesControls';
import { spacing } from '../../theme';
import { AuthUser } from '../../model';

type Props = {
  user: AuthUser;
};

export default function DailyFlowScreen({ user }: Props) {
  const { t } = useTranslation();

  return (
    <Screen style={styles.container}>
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
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
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
