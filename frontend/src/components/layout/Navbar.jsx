import React from 'react';
import { useTranslation } from 'react-i18next';
import PreferencesControls from '../../features/preferences/PreferencesControls';

/**
 * @param {{
 *   onBootstrap?: () => void;
 *   onSignOut?: () => void;
 *   resetSession?: () => void;
 *   openOnboarding?: () => void;
 *   onNavigateToSignIn?: () => void;
 *   onNavigateToSignUp?: () => void;
 *   onNavigateToPricing?: () => void;
 *   isLoggedIn?: boolean;
 * }} props
 */
export default function Navbar({
  onBootstrap,
  onSignOut,
  resetSession,
  openOnboarding,
  onNavigateToSignIn,
  onNavigateToSignUp,
  onNavigateToPricing,
  isLoggedIn = false,
}) {
  const { t } = useTranslation();

  return (
    <header
      style={{
        width: '100%',
        backgroundColor: 'var(--lf-surface-white)',
        borderBottom: '1px solid var(--lf-outline-variant)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0.85rem var(--margin-desktop)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand Logo */}
        <div
          onClick={onBootstrap}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onBootstrap && onBootstrap();
            }
          }}
          style={{
            fontFamily: 'var(--font-family-heading)',
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--lf-primary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            letterSpacing: '-0.02em',
          }}
        >
          LinguistAI
        </div>

        {/* Center Nav Links */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
          }}
        >
          <a
            href="#learn"
            onClick={(e) => { e.preventDefault(); onBootstrap && onBootstrap(); }}
            style={{
              fontFamily: 'var(--font-family-body)',
              fontSize: '0.95rem',
              fontWeight: 500,
              color: 'var(--lf-on-surface-variant)',
              textDecoration: 'none',
              transition: 'color 0.15s ease',
            }}
          >
            Learn
          </a>
          <a
            href="#pricing"
            onClick={(e) => { e.preventDefault(); onNavigateToPricing && onNavigateToPricing(); }}
            style={{
              fontFamily: 'var(--font-family-body)',
              fontSize: '0.95rem',
              fontWeight: 500,
              color: 'var(--lf-on-surface-variant)',
              textDecoration: 'none',
              transition: 'color 0.15s ease',
            }}
          >
            Pricing
          </a>
          <a
            href="#dashboard"
            onClick={(e) => { e.preventDefault(); onBootstrap && onBootstrap(); }}
            style={{
              fontFamily: 'var(--font-family-body)',
              fontSize: '0.95rem',
              fontWeight: 500,
              color: 'var(--lf-on-surface-variant)',
              textDecoration: 'none',
              transition: 'color 0.15s ease',
            }}
          >
            Dashboard
          </a>
          <a
            href="#tools"
            onClick={(e) => e.preventDefault()}
            style={{
              fontFamily: 'var(--font-family-body)',
              fontSize: '0.95rem',
              fontWeight: 500,
              color: 'var(--lf-on-surface-variant)',
              textDecoration: 'none',
              transition: 'color 0.15s ease',
            }}
          >
            Tools
          </a>
        </nav>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <PreferencesControls compact />

          {isLoggedIn ? (
            <>
              {openOnboarding && (
                <button
                  type="button"
                  onClick={openOnboarding}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontFamily: 'var(--font-family-body)',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    color: 'var(--lf-on-surface)',
                    cursor: 'pointer',
                  }}
                >
                  {t('common.setProfile')}
                </button>
              )}
              {onSignOut && (
                <button
                  type="button"
                  onClick={onSignOut}
                  style={{
                    backgroundColor: 'var(--lf-deep-navy)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.55rem 1.25rem',
                    fontFamily: 'var(--font-family-body)',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  {t('common.signOut')}
                </button>
              )}
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onNavigateToSignIn}
                style={{
                  background: 'none',
                  border: 'none',
                  fontFamily: 'var(--font-family-body)',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: 'var(--lf-primary)',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  textUnderlineOffset: '6px',
                  textDecorationThickness: '2px',
                  padding: '0.4rem 0.2rem',
                }}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={onNavigateToSignUp || onNavigateToSignIn}
                style={{
                  backgroundColor: 'var(--lf-deep-navy)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.6rem 1.4rem',
                  fontFamily: 'var(--font-family-body)',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
                  transition: 'opacity 0.15s ease',
                }}
              >
                Get Started
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
