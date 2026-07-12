import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { signInWithGoogleIdToken } from '../lib/api';

export default function SignIn({ onSuccess }) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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

  return (
    <div
      className="app-container"
      style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}
    >
      <div className="logo" style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>
        🌊 LinguaFlow
      </div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: 420 }}>
        Sign in with Google to sync your profile and open your Daily Flow.
      </p>

      {error && (
        <p style={{ color: 'var(--danger)', marginBottom: '1rem', maxWidth: 420 }}>{error}</p>
      )}

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
