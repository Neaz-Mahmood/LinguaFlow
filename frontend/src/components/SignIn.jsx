import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'sonner';
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
        🌊 LinguaFlow
      </div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: 420 }}>
        {isSignUp
          ? 'Create an account to sync your profile and open your Daily Flow.'
          : 'Sign in to sync your profile and open your Daily Flow.'}
      </p>

      <form className="auth-form" onSubmit={handleEmailSubmit}>
        {isSignUp && (
          <>
            <label className="auth-label" htmlFor="auth-name">
              Full name
            </label>
            <input
              id="auth-name"
              className={`auth-input${fieldErrors.name ? ' auth-input-error' : ''}`}
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                clearFieldError('name');
              }}
              disabled={loading}
              aria-invalid={Boolean(fieldErrors.name)}
            />
            {fieldErrors.name && <p className="auth-field-error">{fieldErrors.name}</p>}
          </>
        )}

        <label className="auth-label" htmlFor="auth-email">
          Email
        </label>
        <input
          id="auth-email"
          className={`auth-input${fieldErrors.email ? ' auth-input-error' : ''}`}
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            clearFieldError('email');
          }}
          disabled={loading}
          aria-invalid={Boolean(fieldErrors.email)}
        />
        {fieldErrors.email && <p className="auth-field-error">{fieldErrors.email}</p>}

        <label className="auth-label" htmlFor="auth-password">
          Password
        </label>
        <input
          id="auth-password"
          className={`auth-input${fieldErrors.password ? ' auth-input-error' : ''}`}
          type="password"
          autoComplete={isSignUp ? 'new-password' : 'current-password'}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            clearFieldError('password');
          }}
          disabled={loading}
          aria-invalid={Boolean(fieldErrors.password)}
        />
        {fieldErrors.password && <p className="auth-field-error">{fieldErrors.password}</p>}

        {isSignUp && (
          <>
            <label className="auth-label" htmlFor="auth-confirm-password">
              Confirm password
            </label>
            <input
              id="auth-confirm-password"
              className={`auth-input${fieldErrors.confirmPassword ? ' auth-input-error' : ''}`}
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                clearFieldError('confirmPassword');
              }}
              disabled={loading}
              aria-invalid={Boolean(fieldErrors.confirmPassword)}
            />
            {fieldErrors.confirmPassword && (
              <p className="auth-field-error">{fieldErrors.confirmPassword}</p>
            )}
          </>
        )}

        <button
          type="submit"
          className={`btn btn-primary btn-full${loading ? ' btn-disabled' : ''}`}
          disabled={loading}
        >
          {loading ? 'Please wait…' : isSignUp ? 'Sign up' : 'Sign in'}
        </button>
      </form>

      <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
        {isSignUp ? 'Already have an account?' : 'Need an account?'}{' '}
        <button
          type="button"
          className="auth-toggle"
          onClick={() => {
            setMode(isSignUp ? 'signin' : 'signup');
            resetForm();
          }}
          disabled={loading}
        >
          {isSignUp ? 'Sign in' : 'Sign up'}
        </button>
      </p>

      <div className="auth-divider">
        <span>or</span>
      </div>

      {loading ? (
        <p style={{ color: 'var(--text-secondary)' }}>Signing you in…</p>
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
