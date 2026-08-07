import React from 'react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        width: '100%',
        backgroundColor: 'var(--lf-background-faint)',
        borderTop: '1px solid var(--lf-outline-variant)',
        padding: '2.5rem 0',
        marginTop: 'auto',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 var(--margin-desktop)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        {/* Left section: Logo & Copyright */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div
            style={{
              fontFamily: 'var(--font-family-heading)',
              fontSize: '1.4rem',
              fontWeight: 700,
              color: 'var(--lf-primary)',
              letterSpacing: '-0.02em',
            }}
          >
            LinguistAI
          </div>
          <div
            className="label-sm"
            style={{
              color: 'var(--lf-on-surface-variant)',
              fontSize: '0.825rem',
            }}
          >
            © {year} LinguistAI. All rights reserved.
          </div>
        </div>

        {/* Right section: Links */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.75rem',
            flexWrap: 'wrap',
          }}
        >
          <a
            href="#privacy"
            onClick={(e) => e.preventDefault()}
            className="label-sm"
            style={{
              color: 'var(--lf-on-surface-variant)',
              textDecoration: 'none',
              fontSize: '0.85rem',
              transition: 'color 0.15s ease',
            }}
          >
            Privacy Policy
          </a>
          <a
            href="#terms"
            onClick={(e) => e.preventDefault()}
            className="label-sm"
            style={{
              color: 'var(--lf-on-surface-variant)',
              textDecoration: 'none',
              fontSize: '0.85rem',
              transition: 'color 0.15s ease',
            }}
          >
            Terms of Service
          </a>
          <a
            href="#contact"
            onClick={(e) => e.preventDefault()}
            className="label-sm"
            style={{
              color: 'var(--lf-on-surface-variant)',
              textDecoration: 'none',
              fontSize: '0.85rem',
              transition: 'color 0.15s ease',
            }}
          >
            Contact
          </a>
          <a
            href="#help"
            onClick={(e) => e.preventDefault()}
            className="label-sm"
            style={{
              color: 'var(--lf-on-surface-variant)',
              textDecoration: 'none',
              fontSize: '0.85rem',
              transition: 'color 0.15s ease',
            }}
          >
            Help Center
          </a>
        </div>
      </div>
    </footer>
  );
}
