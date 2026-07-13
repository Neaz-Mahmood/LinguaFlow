import React from 'react';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button, Card, Screen, Text } from '../../components/ui';
import PreferencesControls from '../preferences/PreferencesControls';
import { spacing } from '../../theme';
import { AuthUser } from '../../model';

type Props = {
  user: AuthUser;
  onComplete: () => void;
  onSignOut: () => void;
};

export default function OnboardingScreen({ user, onComplete, onSignOut }: Props) {
  const { t } = useTranslation();

  return (
    <Screen style={styles.container}>
      <Card style={styles.card}>
        <Text variant="title" style={styles.title}>
          {t('mobile.welcome', {
            name: user.name ? t('mobile.welcomeName', { name: user.name }) : '',
          })}
        </Text>
        <Text variant="secondary" style={styles.body}>
          {t('mobile.onboardingBody')}
        </Text>
        <PreferencesControls />
        <Button
          label={t('mobile.continuePlaceholder')}
          variant="primary"
          onPress={onComplete}
          style={styles.button}
        />
        <Button label={t('common.signOut')} variant="ghost" onPress={onSignOut} />
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
  button: {
    marginBottom: spacing[3],
  },
});
