import React, { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {
  fieldErrorsFromZod,
  SignUpInput,
  signInSchema,
  signUpSchema,
} from '../lib/authSchemas';

type Mode = 'signin' | 'signup';

type Props = {
  loading: boolean;
  onGoogleSignIn: () => void;
  onEmailAuth: (
    mode: Mode,
    payload: { email: string; password: string; name?: string },
  ) => void;
};

export default function SignInScreen({
  loading,
  onGoogleSignIn,
  onEmailAuth,
}: Props) {
  const [mode, setMode] = useState<Mode>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof SignUpInput, string>>
  >({});

  const isSignUp = mode === 'signup';

  const clearFieldError = (field: keyof SignUpInput) => {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = () => {
    setFieldErrors({});

    const parsed = isSignUp
      ? signUpSchema.safeParse({ name, email, password, confirmPassword })
      : signInSchema.safeParse({ email, password });

    if (!parsed.success) {
      setFieldErrors(fieldErrorsFromZod(parsed.error));
      Toast.show({
        type: 'error',
        text1: 'Please fix the form errors',
      });
      return;
    }

    if (isSignUp) {
      onEmailAuth('signup', {
        email: parsed.data.email,
        password: parsed.data.password,
        name: parsed.data.name,
      });
      return;
    }

    onEmailAuth('signin', {
      email: parsed.data.email,
      password: parsed.data.password,
    });
  };

  const switchMode = () => {
    setMode(isSignUp ? 'signin' : 'signup');
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFieldErrors({});
  };

  return (
    <View style={styles.container}>
      <Text style={styles.brand}>LinguaFlow</Text>
      <Text style={styles.subtitle}>
        {isSignUp
          ? 'Create an account to start your daily language flow.'
          : 'Sign in to start your daily language flow.'}
      </Text>

      {isSignUp ? (
        <View style={styles.field}>
          <TextInput
            style={[styles.input, fieldErrors.name && styles.inputError]}
            placeholder="Full name"
            placeholderTextColor="#7a8f98"
            autoCapitalize="words"
            autoCorrect={false}
            textContentType="name"
            value={name}
            onChangeText={(value) => {
              setName(value);
              clearFieldError('name');
            }}
            editable={!loading}
          />
          {fieldErrors.name ? (
            <Text style={styles.fieldError}>{fieldErrors.name}</Text>
          ) : null}
        </View>
      ) : null}

      <View style={styles.field}>
        <TextInput
          style={[styles.input, fieldErrors.email && styles.inputError]}
          placeholder="Email"
          placeholderTextColor="#7a8f98"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          textContentType="emailAddress"
          value={email}
          onChangeText={(value) => {
            setEmail(value);
            clearFieldError('email');
          }}
          editable={!loading}
        />
        {fieldErrors.email ? (
          <Text style={styles.fieldError}>{fieldErrors.email}</Text>
        ) : null}
      </View>

      <View style={styles.field}>
        <TextInput
          style={[styles.input, fieldErrors.password && styles.inputError]}
          placeholder="Password (min 8 characters)"
          placeholderTextColor="#7a8f98"
          secureTextEntry
          textContentType={isSignUp ? 'newPassword' : 'password'}
          value={password}
          onChangeText={(value) => {
            setPassword(value);
            clearFieldError('password');
          }}
          editable={!loading}
        />
        {fieldErrors.password ? (
          <Text style={styles.fieldError}>{fieldErrors.password}</Text>
        ) : null}
      </View>

      {isSignUp ? (
        <View style={styles.field}>
          <TextInput
            style={[styles.input, fieldErrors.confirmPassword && styles.inputError]}
            placeholder="Confirm password"
            placeholderTextColor="#7a8f98"
            secureTextEntry
            textContentType="newPassword"
            value={confirmPassword}
            onChangeText={(value) => {
              setConfirmPassword(value);
              clearFieldError('confirmPassword');
            }}
            editable={!loading}
          />
          {fieldErrors.confirmPassword ? (
            <Text style={styles.fieldError}>{fieldErrors.confirmPassword}</Text>
          ) : null}
        </View>
      ) : null}

      <Pressable
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSubmit}
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
        onPress={switchMode}
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
  field: {
    width: '100%',
    maxWidth: 320,
    marginBottom: 12,
  },
  input: {
    width: '100%',
    backgroundColor: '#132a36',
    borderWidth: 1,
    borderColor: '#1f3a48',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#fff',
    fontSize: 16,
  },
  inputError: {
    borderColor: '#ff8a80',
  },
  fieldError: {
    color: '#ff8a80',
    fontSize: 12,
    marginTop: 6,
    marginLeft: 2,
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
});
