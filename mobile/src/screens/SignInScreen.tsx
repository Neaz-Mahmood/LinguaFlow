import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { Button, Screen, Text, TextField } from '../components/ui';
import { theme } from '../theme';
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

    if (isSignUp) {
      const parsed = signUpSchema.safeParse({
        name,
        email,
        password,
        confirmPassword,
      });
      if (!parsed.success) {
        setFieldErrors(fieldErrorsFromZod(parsed.error));
        Toast.show({
          type: 'error',
          text1: 'Please fix the form errors',
        });
        return;
      }
      onEmailAuth('signup', {
        email: parsed.data.email,
        password: parsed.data.password,
        name: parsed.data.name,
      });
      return;
    }

    const parsed = signInSchema.safeParse({ email, password });
    if (!parsed.success) {
      setFieldErrors(fieldErrorsFromZod(parsed.error));
      Toast.show({
        type: 'error',
        text1: 'Please fix the form errors',
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
    <Screen style={styles.container}>
      <Text variant="brand" style={styles.brand}>
        LinguaFlow
      </Text>
      <Text variant="secondary" style={styles.subtitle}>
        {isSignUp
          ? 'Create an account to start your daily language flow.'
          : 'Sign in to start your daily language flow.'}
      </Text>

      <View style={styles.form}>
        {isSignUp ? (
          <TextField
            label="Full name"
            autoCapitalize="words"
            autoCorrect={false}
            textContentType="name"
            value={name}
            onChangeText={(value) => {
              setName(value);
              clearFieldError('name');
            }}
            editable={!loading}
            error={fieldErrors.name}
          />
        ) : null}

        <TextField
          label="Email"
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
          error={fieldErrors.email}
        />

        <TextField
          label="Password"
          secureTextEntry
          textContentType={isSignUp ? 'newPassword' : 'password'}
          value={password}
          onChangeText={(value) => {
            setPassword(value);
            clearFieldError('password');
          }}
          editable={!loading}
          error={fieldErrors.password}
          placeholder="Min 8 characters"
        />

        {isSignUp ? (
          <TextField
            label="Confirm password"
            secureTextEntry
            textContentType="newPassword"
            value={confirmPassword}
            onChangeText={(value) => {
              setConfirmPassword(value);
              clearFieldError('confirmPassword');
            }}
            editable={!loading}
            error={fieldErrors.confirmPassword}
          />
        ) : null}

        <Button
          label={isSignUp ? 'Sign up' : 'Sign in'}
          variant="primary"
          onPress={handleSubmit}
          isDisabled={loading}
          isLoading={loading}
          style={styles.fullWidth}
        />

        <Button
          label={
            isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'
          }
          variant="ghost"
          onPress={switchMode}
          isDisabled={loading}
          style={styles.toggle}
        />

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text variant="label">or</Text>
          <View style={styles.dividerLine} />
        </View>

        <Button
          label="Continue with Google"
          variant="secondary"
          onPress={onGoogleSignIn}
          isDisabled={loading}
          style={styles.fullWidth}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    marginBottom: theme.spacing[3],
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: theme.spacing[8],
    maxWidth: 320,
  },
  form: {
    width: '100%',
    maxWidth: 320,
  },
  fullWidth: {
    width: '100%',
    marginTop: theme.spacing[1],
  },
  toggle: {
    marginTop: theme.spacing[4],
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing[5],
    gap: theme.spacing[3],
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.colors.borderEmphasized,
  },
});
