import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AuthUser } from '../lib/api';

type Props = {
  user: AuthUser;
  onSignOut: () => void;
};

export default function DailyFlowScreen({ user, onSignOut }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.brand}>LinguaFlow</Text>
      <Text style={styles.title}>Daily Flow</Text>
      <Text style={styles.body}>
        You are signed in
        {user.email ? ` as ${user.email}` : ''}. The mobile Daily Flow
        experience will connect here next.
      </Text>
      <Pressable onPress={onSignOut}>
        <Text style={styles.link}>Sign out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1f2a',
    padding: 28,
    justifyContent: 'center',
  },
  brand: {
    color: '#7dd3c7',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },
  body: {
    fontSize: 16,
    color: '#c8d6dc',
    lineHeight: 24,
    marginBottom: 28,
  },
  link: {
    color: '#7dd3c7',
    textDecorationLine: 'underline',
  },
});
