import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Props = {
  loading: boolean;
  error: string | null;
  onSignIn: () => void;
};

export default function SignInScreen({ loading, error, onSignIn }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.brand}>LinguaFlow</Text>
      <Text style={styles.subtitle}>
        Sign in with Google to start your daily language flow.
      </Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={onSignIn}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Continue with Google</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1f2a',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  brand: {
    fontSize: 40,
    fontWeight: '700',
    color: '#7dd3c7',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#c8d6dc',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#1f8a70',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 10,
    minWidth: 240,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    color: '#ff8a80',
    marginBottom: 16,
    textAlign: 'center',
  },
});
