import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import {
  signInWithEmail,
  signInWithGoogleIdToken,
  signUpWithEmail,
} from '../lib/api';

export default function SignIn({ onSuccess }) {
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const isSignUp = mode === 'signup';

  const handleCredential = async (response) => {
    if (!response.credential) {
      setError('No credential returned from Google.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await signInWithGoogleIdToken(response.credential);
      onSuccess(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = isSignUp
        ? await signUpWithEmail(email, password)
        : await signInWithEmail(email, password);
      onSuccess(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
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

      {error && (
        <p style={{ color: 'var(--danger)', marginBottom: '1rem', maxWidth: 420 }}>{error}</p>
      )}

      <form className="auth-form" onSubmit={handleEmailSubmit}>
        <label className="auth-label" htmlFor="auth-email">
          Email
        </label>
        <input
          id="auth-email"
          className="auth-input"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />

        <label className="auth-label" htmlFor="auth-password">
          Password
        </label>
        <input
          id="auth-password"
          className="auth-input"
          type="password"
          autoComplete={isSignUp ? 'new-password' : 'current-password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          required
          disabled={loading}
        />

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
            setError(null);
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
          onError={() => setError('Google sign-in was cancelled or failed.')}
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
