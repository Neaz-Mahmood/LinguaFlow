import React, { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type Mode = 'signin' | 'signup';

type Props = {
  loading: boolean;
  error: string | null;
  onGoogleSignIn: () => void;
  onEmailAuth: (mode: Mode, email: string, password: string) => void;
};

export default function SignInScreen({
  loading,
  error,
  onGoogleSignIn,
  onEmailAuth,
}: Props) {
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isSignUp = mode === 'signup';

  return (
    <View style={styles.container}>
      <Text style={styles.brand}>LinguaFlow</Text>
      <Text style={styles.subtitle}>
        {isSignUp
          ? 'Create an account to start your daily language flow.'
          : 'Sign in to start your daily language flow.'}
      </Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#7a8f98"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        textContentType="emailAddress"
        value={email}
        onChangeText={setEmail}
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder="Password (min 8 characters)"
        placeholderTextColor="#7a8f98"
        secureTextEntry
        textContentType={isSignUp ? 'newPassword' : 'password'}
        value={password}
        onChangeText={setPassword}
        editable={!loading}
      />

      <Pressable
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={() => onEmailAuth(mode, email.trim(), password)}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            {isSignUp ? 'Sign up' : 'Sign in'}
          </Text>
        )}
      </Pressable>

      <Pressable
        onPress={() => setMode(isSignUp ? 'signin' : 'signup')}
        disabled={loading}
        style={styles.toggleWrap}
      >
        <Text style={styles.toggleText}>
          {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
        </Text>
      </Pressable>

      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerLabel}>or</Text>
        <View style={styles.dividerLine} />
      </View>

      <Pressable
        style={[styles.googleButton, loading && styles.buttonDisabled]}
        onPress={onGoogleSignIn}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Continue with Google</Text>
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
  input: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#132a36',
    borderWidth: 1,
    borderColor: '#1f3a48',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#fff',
    fontSize: 16,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#1f8a70',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 10,
    minWidth: 240,
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
    marginTop: 4,
  },
  googleButton: {
    backgroundColor: '#1f3a48',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 10,
    minWidth: 240,
    width: '100%',
    maxWidth: 320,
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
  toggleWrap: {
    marginTop: 16,
  },
  toggleText: {
    color: '#7dd3c7',
    fontSize: 14,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
    marginVertical: 20,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#1f3a48',
  },
  dividerLabel: {
    color: '#7a8f98',
    fontSize: 13,
  },
  error: {
    color: '#ff8a80',
    marginBottom: 16,
    textAlign: 'center',
  },
});
