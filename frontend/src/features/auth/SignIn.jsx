import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Button } from '@astryxdesign/core/Button';
import { Text } from '@astryxdesign/core/Text';
import { TextInput } from '@astryxdesign/core/TextInput';
import { VStack } from '@astryxdesign/core/Layout';
import {
  signInWithEmail,
  signInWithGoogleIdToken,
  signUpWithEmail,
} from '../../lib/api';
import { fieldErrorsFromZod, getSignInSchema, getSignUpSchema } from '../../lib/authSchemas';
import PreferencesControls from '../preferences/PreferencesControls';

export default function SignIn({ onSuccess }) {
  const { t } = useTranslation();
  const [mode, setMode] = useState('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const isSignUp = mode === 'signup';

  const clearFieldError = (field) => {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFieldErrors({});
  };

  const handleCredential = async (response) => {
    if (!response.credential) {
      toast.error(t('auth.noGoogleCredential'));
      return;
    }

    setLoading(true);
    setFieldErrors({});
    try {
      const data = await signInWithGoogleIdToken(response.credential);
      toast.success(t('auth.signedInSuccess'));
      onSuccess(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t('auth.signInFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (event) => {
    event.preventDefault();
    setFieldErrors({});

    const parsed = isSignUp
      ? getSignUpSchema().safeParse({ name, email, password, confirmPassword })
      : getSignInSchema().safeParse({ email, password });

    if (!parsed.success) {
      setFieldErrors(fieldErrorsFromZod(parsed.error));
      toast.error(t('auth.formErrors'));
      return;
    }

    setLoading(true);
    try {
      const data = isSignUp
        ? await signUpWithEmail(parsed.data.email, parsed.data.password, parsed.data.name)
        : await signInWithEmail(parsed.data.email, parsed.data.password);
      toast.success(isSignUp ? t('auth.accountCreated') : t('auth.signedInSuccess'));
      onSuccess(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t('auth.authFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="app-container"
      style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}
    >
      <div className="logo" style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>
        {t('common.brand')}
      </div>
      <Text type="supporting" color="secondary" as="p" display="block">
        {isSignUp ? t('auth.signUpTitle') : t('auth.signInTitle')}
      </Text>

      <PreferencesControls />

      <form className="auth-form" onSubmit={handleEmailSubmit} style={{ marginTop: '1.5rem' }}>
        <VStack gap={3}>
          {isSignUp && (
            <TextInput
              label={t('auth.fullName')}
              value={name}
              onChange={(value) => {
                setName(value);
                clearFieldError('name');
              }}
              isDisabled={loading}
              status={fieldErrors.name ? { type: 'error', message: fieldErrors.name } : undefined}
              htmlName="name"
            />
          )}

          <TextInput
            type="email"
            label={t('auth.email')}
            value={email}
            onChange={(value) => {
              setEmail(value);
              clearFieldError('email');
            }}
            isDisabled={loading}
            status={fieldErrors.email ? { type: 'error', message: fieldErrors.email } : undefined}
            htmlName="email"
          />

          <TextInput
            type="password"
            label={t('auth.password')}
            value={password}
            onChange={(value) => {
              setPassword(value);
              clearFieldError('password');
            }}
            isDisabled={loading}
            status={
              fieldErrors.password ? { type: 'error', message: fieldErrors.password } : undefined
            }
            htmlName="password"
          />

          {isSignUp && (
            <TextInput
              type="password"
              label={t('auth.confirmPassword')}
              value={confirmPassword}
              onChange={(value) => {
                setConfirmPassword(value);
                clearFieldError('confirmPassword');
              }}
              isDisabled={loading}
              status={
                fieldErrors.confirmPassword
                  ? { type: 'error', message: fieldErrors.confirmPassword }
                  : undefined
              }
              htmlName="confirmPassword"
            />
          )}

          <Button
            type="submit"
            label={
              loading
                ? t('common.pleaseWait')
                : isSignUp
                  ? t('auth.signUp')
                  : t('auth.signIn')
            }
            variant="primary"
            isLoading={loading}
            isDisabled={loading}
          />
        </VStack>
      </form>

      <Text type="supporting" color="secondary" as="p" display="block">
        {isSignUp ? t('auth.haveAccount') : t('auth.needAccount')}{' '}
        <Button
          type="button"
          label={isSignUp ? t('auth.signIn') : t('auth.signUp')}
          variant="ghost"
          size="sm"
          isDisabled={loading}
          onClick={() => {
            setMode(isSignUp ? 'signin' : 'signup');
            resetForm();
          }}
        />
      </Text>

      <div className="auth-divider">
        <span>{t('common.or')}</span>
      </div>

      {loading ? (
        <Text type="supporting" color="secondary">
          {t('auth.signingIn')}
        </Text>
      ) : (
        <GoogleLogin
          onSuccess={handleCredential}
          onError={() => toast.error(t('auth.googleCancelled'))}
          useOneTap={false}
          theme="filled_black"
          size="large"
          text="continue_with"
          shape="rectangular"
        />
      )}
    </div>
  );
}
