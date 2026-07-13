import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, Card, Screen, Text } from '../components/ui';
import { theme } from '../theme';
import { AuthUser } from '../lib/api';

type Props = {
  user: AuthUser;
  onSignOut: () => void;
};

export default function DailyFlowScreen({ user, onSignOut }: Props) {
  return (
    <Screen style={styles.container}>
      <Text variant="label" style={styles.brand}>
        LinguaFlow
      </Text>
      <Card style={styles.card}>
        <Text variant="title" style={styles.title}>
          Daily Flow
        </Text>
        <Text variant="secondary" style={styles.body}>
          You are signed in
          {user.email ? ` as ${user.email}` : ''}. The mobile Daily Flow experience
          will connect here next.
        </Text>
        <Button label="Sign out" variant="secondary" onPress={onSignOut} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  brand: {
    marginBottom: theme.spacing[3],
    color: theme.colors.cyan,
    textTransform: 'uppercase',
    letterSpacing: 1,
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
});
