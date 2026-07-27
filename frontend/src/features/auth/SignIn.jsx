import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import {
  signInWithEmail,
  signInWithGoogleIdToken,
  signUpWithEmail,
} from '../../lib/api';
import { fieldErrorsFromZod, getSignInSchema, getSignUpSchema } from '../../lib/authSchemas';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

export default function SignIn({ onSuccess, onNavigateToPricing }) {
  const { t } = useTranslation();
  const [mode, setMode] = useState('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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

  const handleForgotPassword = (e) => {
    e.preventDefault();
    toast.info('Password reset instructions have been sent to your email.');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--lf-background-faint)' }}>
      {/* Top Navbar */}
      <Navbar
        onNavigateToSignIn={() => { setMode('signin'); resetForm(); }}
        onNavigateToSignUp={() => { setMode('signup'); resetForm(); }}
        onNavigateToPricing={onNavigateToPricing}
        isLoggedIn={false}
      />

      {/* Main Content Area with Centered Card */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '3rem 1.5rem',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '460px',
            backgroundColor: '#ffffff',
            border: '1px solid #c3c7ca',
            borderRadius: '16px',
            padding: '2.5rem 2.25rem',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.04)',
            boxSizing: 'border-box',
          }}
        >
          {/* Form Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1
              style={{
                fontFamily: 'var(--font-family-heading)',
                fontSize: '2rem',
                fontWeight: 600,
                color: 'var(--lf-primary)',
                margin: 0,
                letterSpacing: '-0.01em',
              }}
            >
              {isSignUp ? 'Create Your Account' : 'Welcome Back'}
            </h1>
            <p
              style={{
                fontFamily: 'var(--font-family-body)',
                fontSize: '0.95rem',
                color: 'var(--lf-on-surface-variant)',
                marginTop: '0.5rem',
                marginBottom: 0,
              }}
            >
              {isSignUp
                ? 'Join LinguistAI to start your daily language flow.'
                : 'Continue your language learning journey.'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleEmailSubmit} style={{ width: '100%' }}>
            {/* Full Name field (Sign Up mode) */}
            {isSignUp && (
              <div style={{ marginBottom: '1.25rem' }}>
                <label
                  htmlFor="auth-name"
                  className="label-md"
                  style={{
                    display: 'block',
                    marginBottom: '0.4rem',
                    color: 'var(--lf-on-surface)',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                  }}
                >
                  Full Name
                </label>
                <input
                  id="auth-name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    clearFieldError('name');
                  }}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    border: fieldErrors.name ? '1px solid var(--lf-error)' : '1px solid #c3c7ca',
                    backgroundColor: '#ffffff',
                    fontFamily: 'var(--font-family-body)',
                    fontSize: '0.95rem',
                    color: 'var(--lf-on-surface)',
                    boxSizing: 'border-box',
                    outline: 'none',
                    transition: 'border-color 0.15s ease',
                  }}
                />
                {fieldErrors.name && (
                  <span className="label-sm" style={{ color: 'var(--lf-error)', marginTop: '0.3rem', display: 'block' }}>
                    {fieldErrors.name}
                  </span>
                )}
              </div>
            )}

            {/* Email Address field */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label
                htmlFor="auth-email"
                className="label-md"
                style={{
                  display: 'block',
                  marginBottom: '0.4rem',
                  color: 'var(--lf-on-surface)',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                }}
              >
                Email Address
              </label>
              <input
                id="auth-email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearFieldError('email');
                }}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: fieldErrors.email ? '1px solid var(--lf-error)' : '1px solid #c3c7ca',
                  backgroundColor: '#ffffff',
                  fontFamily: 'var(--font-family-body)',
                  fontSize: '0.95rem',
                  color: 'var(--lf-on-surface)',
                  boxSizing: 'border-box',
                  outline: 'none',
                  transition: 'border-color 0.15s ease',
                }}
              />
              {fieldErrors.email && (
                <span className="label-sm" style={{ color: 'var(--lf-error)', marginTop: '0.3rem', display: 'block' }}>
                  {fieldErrors.email}
                </span>
              )}
            </div>

            {/* Password field with Forgot Password row */}
            <div style={{ marginBottom: isSignUp ? '1.25rem' : '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label
                  htmlFor="auth-password"
                  className="label-md"
                  style={{
                    color: 'var(--lf-on-surface)',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    margin: 0,
                  }}
                >
                  Password
                </label>
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="label-sm"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--lf-on-surface-variant)',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      textDecoration: 'none',
                      padding: 0,
                    }}
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div style={{ position: 'relative', width: '100%' }}>
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    clearFieldError('password');
                  }}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '0.75rem 2.75rem 0.75rem 1rem',
                    borderRadius: '8px',
                    border: fieldErrors.password ? '1px solid var(--lf-error)' : '1px solid #c3c7ca',
                    backgroundColor: '#ffffff',
                    fontFamily: 'var(--font-family-body)',
                    fontSize: '0.95rem',
                    color: 'var(--lf-on-surface)',
                    boxSizing: 'border-box',
                    outline: 'none',
                    transition: 'border-color 0.15s ease',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--lf-subtle-gray)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0.2rem',
                  }}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
              {fieldErrors.password && (
                <span className="label-sm" style={{ color: 'var(--lf-error)', marginTop: '0.3rem', display: 'block' }}>
                  {fieldErrors.password}
                </span>
              )}
            </div>

            {/* Confirm Password field (Sign Up mode) */}
            {isSignUp && (
              <div style={{ marginBottom: '1.5rem' }}>
                <label
                  htmlFor="auth-confirm-password"
                  className="label-md"
                  style={{
                    display: 'block',
                    marginBottom: '0.4rem',
                    color: 'var(--lf-on-surface)',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                  }}
                >
                  Confirm Password
                </label>
                <input
                  id="auth-confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    clearFieldError('confirmPassword');
                  }}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    border: fieldErrors.confirmPassword ? '1px solid var(--lf-error)' : '1px solid #c3c7ca',
                    backgroundColor: '#ffffff',
                    fontFamily: 'var(--font-family-body)',
                    fontSize: '0.95rem',
                    color: 'var(--lf-on-surface)',
                    boxSizing: 'border-box',
                    outline: 'none',
                    transition: 'border-color 0.15s ease',
                  }}
                />
                {fieldErrors.confirmPassword && (
                  <span className="label-sm" style={{ color: 'var(--lf-error)', marginTop: '0.3rem', display: 'block' }}>
                    {fieldErrors.confirmPassword}
                  </span>
                )}
              </div>
            )}

            {/* Submit Primary Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.85rem',
                backgroundColor: 'var(--lf-deep-navy)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontFamily: 'var(--font-family-body)',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
                transition: 'background-color 0.15s ease',
              }}
            >
              {loading ? (
                <span>Please wait...</span>
              ) : isSignUp ? (
                'Sign Up'
              ) : (
                'Login'
              )}
            </button>
          </form>

          {/* Divider */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              margin: '1.75rem 0',
              width: '100%',
            }}
          >
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e0e3e6' }} />
            <span
              className="label-sm"
              style={{
                padding: '0 0.85rem',
                color: 'var(--lf-on-surface-variant)',
                fontSize: '0.75rem',
                letterSpacing: '0.05em',
                fontWeight: 500,
              }}
            >
              OR
            </span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e0e3e6' }} />
          </div>

          {/* Google Login Button */}
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            {loading ? (
              <span className="body-md" style={{ color: 'var(--lf-on-surface-variant)' }}>
                Signing in...
              </span>
            ) : (
              <div style={{ width: '100%' }}>
                <GoogleLogin
                  onSuccess={handleCredential}
                  onError={() => toast.error('Google Sign-In was cancelled or failed.')}
                  useOneTap={false}
                  theme="outline"
                  size="large"
                  text="continue_with"
                  shape="rectangular"
                  width="100%"
                />
              </div>
            )}
          </div>

          {/* Toggle between Sign In and Sign Up */}
          <div style={{ textAlign: 'center', marginTop: '1.75rem' }}>
            <p className="body-md" style={{ margin: 0, color: 'var(--lf-on-surface-variant)', fontSize: '0.95rem' }}>
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => {
                  setMode(isSignUp ? 'signin' : 'signup');
                  resetForm();
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--lf-primary)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  padding: 0,
                  fontFamily: 'var(--font-family-body)',
                }}
              >
                {isSignUp ? 'Log in' : 'Sign up'}
              </button>
            </p>
          </div>
        </div>
      </main>

      {/* Bottom Footer */}
      <Footer />
    </div>
  );
}
