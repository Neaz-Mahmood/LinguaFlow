import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { Button, Screen, Text, TextField } from '../components/ui';
import PreferencesControls from '../preferences/PreferencesControls';
import { spacing, useAppTheme } from '../theme';
import {
  fieldErrorsFromZod,
  getSignInSchema,
  getSignUpSchema,
  SignUpInput,
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
  const { t } = useTranslation();
  const { colors } = useAppTheme();
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
      const parsed = getSignUpSchema().safeParse({
        name,
        email,
        password,
        confirmPassword,
      });
      if (!parsed.success) {
        setFieldErrors(fieldErrorsFromZod(parsed.error));
        Toast.show({
          type: 'error',
          text1: t('auth.formErrors'),
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

    const parsed = getSignInSchema().safeParse({ email, password });
    if (!parsed.success) {
      setFieldErrors(fieldErrorsFromZod(parsed.error));
      Toast.show({
        type: 'error',
        text1: t('auth.formErrors'),
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
        {t('common.brand')}
      </Text>
      <Text variant="secondary" style={styles.subtitle}>
        {isSignUp ? t('auth.mobileSignUpTitle') : t('auth.mobileSignInTitle')}
      </Text>

      <View style={styles.form}>
        <PreferencesControls />

        {isSignUp ? (
          <TextField
            label={t('auth.fullName')}
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
          label={t('auth.email')}
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
          label={t('auth.password')}
          secureTextEntry
          textContentType={isSignUp ? 'newPassword' : 'password'}
          value={password}
          onChangeText={(value) => {
            setPassword(value);
            clearFieldError('password');
          }}
          editable={!loading}
          error={fieldErrors.password}
          placeholder={t('auth.passwordPlaceholder')}
        />

        {isSignUp ? (
          <TextField
            label={t('auth.confirmPassword')}
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
          label={isSignUp ? t('auth.signUp') : t('auth.signIn')}
          variant="primary"
          onPress={handleSubmit}
          isDisabled={loading}
          isLoading={loading}
          style={styles.fullWidth}
        />

        <Button
          label={isSignUp ? t('auth.toggleToSignIn') : t('auth.toggleToSignUp')}
          variant="ghost"
          onPress={switchMode}
          isDisabled={loading}
          style={styles.toggle}
        />

        <View style={styles.dividerRow}>
          <View style={[styles.dividerLine, { backgroundColor: colors.borderEmphasized }]} />
          <Text variant="label">{t('common.or')}</Text>
          <View style={[styles.dividerLine, { backgroundColor: colors.borderEmphasized }]} />
        </View>

        <Button
          label={t('auth.continueWithGoogle')}
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
    marginBottom: spacing[3],
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: spacing[6],
    maxWidth: 320,
  },
  form: {
    width: '100%',
    maxWidth: 320,
  },
  fullWidth: {
    width: '100%',
    marginTop: spacing[1],
  },
  toggle: {
    marginTop: spacing[4],
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing[5],
    gap: spacing[3],
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
});
