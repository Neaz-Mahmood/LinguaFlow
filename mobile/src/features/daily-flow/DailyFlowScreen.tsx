import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, Card, Screen, Text } from '../../components/ui';
import { AuthUser } from '../../model';
import { spacing } from '../../theme';
import SpanishConversationScreen from './SpanishConversationScreen';

type Props = {
  user: AuthUser;
};

export default function DailyFlowScreen({ user }: Props) {
  if ((user.targetLanguage ?? 'Spanish').toLowerCase() === 'spanish') {
    return <SpanishConversationScreen />;
  }

  return (
    <Screen style={styles.unavailableScreen}>
      <Card style={styles.card}>
        <Text variant="title" style={styles.title}>
          Spanish conversation preview
        </Text>
        <Text variant="secondary" style={styles.body}>
          AI conversation and feedback are currently available for Spanish only.
          French, German, and Japanese will become available after their Daily
          Flow content and evaluation fixtures are ready.
        </Text>
        <Button label="Coming soon" isDisabled variant="secondary" />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  unavailableScreen: {
    justifyContent: 'center',
  },
  card: {
    width: '100%',
  },
  title: {
    marginBottom: spacing[3],
  },
  body: {
    marginBottom: spacing[5],
  },
});
