import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, Card, Screen, Text } from '../components/ui';
import { theme } from '../theme';
import { AuthUser } from '../lib/api';

type Props = {
  user: AuthUser;
  onComplete: () => void;
  onSignOut: () => void;
};

export default function OnboardingScreen({ user, onComplete, onSignOut }: Props) {
  return (
    <Screen style={styles.container}>
      <Card style={styles.card}>
        <Text variant="title" style={styles.title}>
          Welcome{user.name ? `, ${user.name}` : ''}
        </Text>
        <Text variant="secondary" style={styles.body}>
          Complete onboarding to set your target language, level, and daily goals.
          Full wizard UI will land with the Expo Daily Flow port.
        </Text>
        <Button
          label="Continue (placeholder)"
          variant="primary"
          onPress={onComplete}
          style={styles.button}
        />
        <Button label="Sign out" variant="ghost" onPress={onSignOut} />
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
    marginBottom: theme.spacing[3],
  },
  body: {
    marginBottom: theme.spacing[6],
  },
  button: {
    marginBottom: theme.spacing[3],
  },
});
