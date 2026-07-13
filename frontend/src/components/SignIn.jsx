import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'sonner';
import { Button } from '@astryxdesign/core/Button';
import { Text } from '@astryxdesign/core/Text';
import { TextInput } from '@astryxdesign/core/TextInput';
import { VStack } from '@astryxdesign/core/Layout';
import {
  signInWithEmail,
  signInWithGoogleIdToken,
  signUpWithEmail,
} from '../lib/api';
import { fieldErrorsFromZod, signInSchema, signUpSchema } from '../lib/authSchemas';

export default function SignIn({ onSuccess }) {
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
      toast.error('No credential returned from Google.');
      return;
    }

    setLoading(true);
    setFieldErrors({});
    try {
      const data = await signInWithGoogleIdToken(response.credential);
      toast.success('Signed in successfully');
      onSuccess(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (event) => {
    event.preventDefault();
    setFieldErrors({});

    const parsed = isSignUp
      ? signUpSchema.safeParse({ name, email, password, confirmPassword })
      : signInSchema.safeParse({ email, password });

    if (!parsed.success) {
      setFieldErrors(fieldErrorsFromZod(parsed.error));
      toast.error('Please fix the form errors');
      return;
    }

    setLoading(true);
    try {
      const data = isSignUp
        ? await signUpWithEmail(parsed.data.email, parsed.data.password, parsed.data.name)
        : await signInWithEmail(parsed.data.email, parsed.data.password);
      toast.success(isSignUp ? 'Account created successfully' : 'Signed in successfully');
      onSuccess(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Authentication failed');
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
        LinguaFlow
      </div>
      <Text type="supporting" color="secondary" as="p" display="block">
        {isSignUp
          ? 'Create an account to sync your profile and open your Daily Flow.'
          : 'Sign in to sync your profile and open your Daily Flow.'}
      </Text>

      <form className="auth-form" onSubmit={handleEmailSubmit} style={{ marginTop: '2rem' }}>
        <VStack gap={3}>
          {isSignUp && (
            <TextInput
              label="Full name"
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
            label="Email"
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
            label="Password"
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
              label="Confirm password"
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
            label={loading ? 'Please wait…' : isSignUp ? 'Sign up' : 'Sign in'}
            variant="primary"
            isLoading={loading}
            isDisabled={loading}
          />
        </VStack>
      </form>

      <Text type="supporting" color="secondary" as="p" display="block">
        {isSignUp ? 'Already have an account?' : 'Need an account?'}{' '}
        <Button
          type="button"
          label={isSignUp ? 'Sign in' : 'Sign up'}
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
        <span>or</span>
      </div>

      {loading ? (
        <Text type="supporting" color="secondary">
          Signing you in…
        </Text>
      ) : (
        <GoogleLogin
          onSuccess={handleCredential}
          onError={() => toast.error('Google sign-in was cancelled or failed.')}
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
