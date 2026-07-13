import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AuthUser } from '../lib/api';

type Props = {
  user: AuthUser;
  onComplete: () => void;
  onSignOut: () => void;
};

export default function OnboardingScreen({ user, onComplete, onSignOut }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome{user.name ? `, ${user.name}` : ''}</Text>
      <Text style={styles.body}>
        Complete onboarding to set your target language, level, and daily goals.
        Full wizard UI will land with the Expo Daily Flow port.
      </Text>
      <Pressable style={styles.button} onPress={onComplete}>
        <Text style={styles.buttonText}>Continue (placeholder)</Text>
      </Pressable>
      <Pressable onPress={onSignOut}>
        <Text style={styles.link}>Sign out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7f8',
    padding: 28,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0b1f2a',
    marginBottom: 12,
  },
  body: {
    fontSize: 16,
    color: '#4a5c66',
    lineHeight: 24,
    marginBottom: 28,
  },
  button: {
    backgroundColor: '#1f8a70',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  link: {
    textAlign: 'center',
    color: '#4a5c66',
    textDecorationLine: 'underline',
  },
});
