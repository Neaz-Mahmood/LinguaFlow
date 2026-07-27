import React, { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

export default function Pricing({ onNavigateToSignIn, onNavigateToSignUp, onNavigateHome }) {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: 'Can I cancel anytime?',
      answer:
        'Yes, absolutely. LinguistAI is a month-to-month service. You can cancel your subscription from your account settings at any time, and you will retain access until the end of your current billing period.',
    },
    {
      question: 'Do you offer student discounts?',
      answer:
        'We do! Students with a valid .edu email address or university ID can receive a 15% discount on our Pro annual plan. Contact our support team with your proof of enrollment to get your discount code.',
    },
    {
      question: 'What languages are supported?',
      answer:
        "Currently, we support Spanish, French, German, Japanese, Mandarin Chinese, and Brazilian Portuguese. We're constantly adding new languages based on community demand!",
    },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--lf-background-faint)' }}>
      {/* Navbar */}
      <Navbar
        onBootstrap={onNavigateHome}
        onNavigateToSignIn={onNavigateToSignIn}
        onNavigateToSignUp={onNavigateToSignUp}
        isLoggedIn={false}
      />

      <main style={{ flex: 1 }}>
        {/* Hero Section */}
        <section
          style={{
            padding: '4rem 1.5rem 2.5rem',
            textAlign: 'center',
            maxWidth: '1200px',
            margin: '0 auto',
          }}
        >
          <span
            className="label-md"
            style={{
              display: 'inline-block',
              padding: '0.35rem 1rem',
              backgroundColor: 'var(--lf-primary-fixed)',
              color: 'var(--lf-on-primary-fixed-variant)',
              borderRadius: '9999px',
              marginBottom: '1rem',
              fontWeight: 500,
            }}
          >
            Simple Plans
          </span>
          <h1
            className="display-lg"
            style={{
              color: 'var(--lf-deep-navy)',
              margin: '0 0 1rem 0',
              fontSize: 'clamp(2rem, 5vw, 3.25rem)',
            }}
          >
            Choose Your Path to Fluency
          </h1>
          <p
            className="body-lg"
            style={{
              color: 'var(--lf-on-surface-variant)',
              maxWidth: '640px',
              margin: '0 auto',
            }}
          >
            Master any language with AI-driven personalized learning. Start for free, upgrade as you grow.
          </p>
        </section>

        {/* Pricing Cards Section */}
        <section
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 1.5rem 4rem',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem',
              alignItems: 'stretch',
            }}
          >
            {/* Free Plan */}
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #c3c7ca',
                borderRadius: '16px',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
            >
              <div>
                <h3
                  className="headline-lg"
                  style={{ color: 'var(--lf-deep-navy)', margin: '0 0 0.5rem 0', fontSize: '1.75rem' }}
                >
                  Free
                </h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem', marginBottom: '2rem' }}>
                  <span style={{ fontSize: '2.25rem', fontWeight: 700, color: 'var(--lf-deep-navy)' }}>$0</span>
                  <span className="body-md" style={{ color: 'var(--lf-subtle-gray)' }}>/mo</span>
                </div>

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--lf-on-surface)' }}>
                    <span style={{ color: 'var(--lf-deep-navy)', fontWeight: 'bold' }}>✓</span>
                    <span className="body-md">15 mins AI Chat daily</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--lf-on-surface)' }}>
                    <span style={{ color: 'var(--lf-deep-navy)', fontWeight: 'bold' }}>✓</span>
                    <span className="body-md">100 Flashcards</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--lf-on-surface)' }}>
                    <span style={{ color: 'var(--lf-deep-navy)', fontWeight: 'bold' }}>✓</span>
                    <span className="body-md">Basic Progress Tracking</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={onNavigateToSignUp}
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  border: '1px solid var(--lf-deep-navy)',
                  backgroundColor: 'transparent',
                  color: 'var(--lf-deep-navy)',
                  borderRadius: '8px',
                  fontFamily: 'var(--font-family-body)',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease',
                }}
              >
                Current Plan
              </button>
            </div>

            {/* Pro Plan (Recommended) */}
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '2px solid var(--lf-deep-navy)',
                borderRadius: '16px',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 8px 24px rgba(28, 43, 51, 0.08)',
              }}
            >
              <div
                className="label-sm"
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  backgroundColor: 'var(--lf-deep-navy)',
                  color: '#ffffff',
                  padding: '0.35rem 1rem',
                  borderBottomLeftRadius: '8px',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                }}
              >
                RECOMMENDED
              </div>

              <div>
                <h3
                  className="headline-lg"
                  style={{ color: 'var(--lf-deep-navy)', margin: '0 0 0.5rem 0', fontSize: '1.75rem' }}
                >
                  Pro
                </h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem', marginBottom: '2rem' }}>
                  <span style={{ fontSize: '2.25rem', fontWeight: 700, color: 'var(--lf-deep-navy)' }}>$12</span>
                  <span className="body-md" style={{ color: 'var(--lf-subtle-gray)' }}>/mo</span>
                </div>

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--lf-on-surface)', fontWeight: 600 }}>
                    <span style={{ color: 'var(--lf-deep-navy)', fontWeight: 'bold' }}>✓</span>
                    <span className="body-md">Unlimited AI Chat</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--lf-on-surface)' }}>
                    <span style={{ color: 'var(--lf-deep-navy)', fontWeight: 'bold' }}>✓</span>
                    <span className="body-md">Advanced Vocab Lab</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--lf-on-surface)' }}>
                    <span style={{ color: 'var(--lf-deep-navy)', fontWeight: 'bold' }}>✓</span>
                    <span className="body-md">Personal Learning Path</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--lf-on-surface)' }}>
                    <span style={{ color: 'var(--lf-deep-navy)', fontWeight: 'bold' }}>✓</span>
                    <span className="body-md">Priority Support</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={onNavigateToSignUp}
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
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(28, 43, 51, 0.15)',
                  transition: 'opacity 0.15s ease',
                }}
              >
                Start 7-Day Trial
              </button>
            </div>

            {/* Team Plan */}
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #c3c7ca',
                borderRadius: '16px',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <h3
                  className="headline-lg"
                  style={{ color: 'var(--lf-deep-navy)', margin: '0 0 0.5rem 0', fontSize: '1.75rem' }}
                >
                  Team
                </h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem', marginBottom: '2rem' }}>
                  <span style={{ fontSize: '2.25rem', fontWeight: 700, color: 'var(--lf-deep-navy)' }}>$49</span>
                  <span className="body-md" style={{ color: 'var(--lf-subtle-gray)' }}>/mo/user</span>
                </div>

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--lf-on-surface)' }}>
                    <span style={{ color: 'var(--lf-deep-navy)', fontWeight: 'bold' }}>✓</span>
                    <span className="body-md">Group Learning</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--lf-on-surface)' }}>
                    <span style={{ color: 'var(--lf-deep-navy)', fontWeight: 'bold' }}>✓</span>
                    <span className="body-md">Admin Dashboard</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--lf-on-surface)' }}>
                    <span style={{ color: 'var(--lf-deep-navy)', fontWeight: 'bold' }}>✓</span>
                    <span className="body-md">Custom Content</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--lf-on-surface)' }}>
                    <span style={{ color: 'var(--lf-deep-navy)', fontWeight: 'bold' }}>✓</span>
                    <span className="body-md">Dedicated Success Manager</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={onNavigateToSignIn}
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  border: '1px solid var(--lf-deep-navy)',
                  backgroundColor: 'transparent',
                  color: 'var(--lf-deep-navy)',
                  borderRadius: '8px',
                  fontFamily: 'var(--font-family-body)',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease',
                }}
              >
                Contact Sales
              </button>
            </div>
          </div>
        </section>

        {/* Bento Feature Highlight Section */}
        <section style={{ backgroundColor: '#ffffff', padding: '4rem 1.5rem' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {/* Feature 1: Neural Vocab Lab */}
              <div
                style={{
                  gridColumn: 'span 2',
                  backgroundColor: 'var(--lf-surface-container-low)',
                  borderRadius: '16px',
                  padding: '2.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  minHeight: '260px',
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🧠</div>
                <h4 className="headline-lg" style={{ color: 'var(--lf-deep-navy)', margin: '0 0 0.5rem 0', fontSize: '1.5rem' }}>
                  Neural Vocabulary Lab
                </h4>
                <p className="body-lg" style={{ color: 'var(--lf-on-surface-variant)', margin: 0, fontSize: '1rem' }}>
                  Our AI predicts which words you're about to forget and injects them seamlessly into your daily practice flow.
                </p>
              </div>

              {/* Feature 2: 24/7 AI Tutors */}
              <div
                style={{
                  gridColumn: 'span 2',
                  backgroundColor: 'var(--lf-primary-container)',
                  borderRadius: '16px',
                  padding: '2.25rem',
                  color: '#ffffff',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  minHeight: '260px',
                }}
              >
                <div>
                  <h4 className="headline-lg" style={{ color: '#ffffff', margin: '0 0 0.5rem 0', fontSize: '1.5rem' }}>
                    24/7 AI Tutors
                  </h4>
                  <p className="body-md" style={{ color: 'var(--lf-on-primary-container)', margin: 0 }}>
                    Never wait for a class. Practice speaking with context-aware AI characters that adapt to your exact level.
                  </p>
                </div>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255,255,255,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    flexShrink: 0,
                    marginLeft: '1.5rem',
                  }}
                >
                  💬
                </div>
              </div>

              {/* Feature 3: Student Discount */}
              <div
                style={{
                  backgroundColor: 'var(--lf-tertiary-container)',
                  borderRadius: '16px',
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <h4 className="title-md" style={{ color: 'var(--lf-on-tertiary-container)', margin: 0 }}>
                  Student Discount
                </h4>
                <div style={{ fontSize: '2.25rem', fontWeight: 700, color: 'var(--lf-on-tertiary-container)', marginTop: '1rem' }}>
                  15% OFF
                </div>
              </div>

              {/* Feature 4: Global Support */}
              <div
                style={{
                  backgroundColor: 'var(--lf-surface-container-highest)',
                  borderRadius: '16px',
                  padding: '1.75rem',
                  border: '1px solid var(--lf-outline-variant)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <h4 className="title-md" style={{ color: 'var(--lf-deep-navy)', margin: 0 }}>
                  Global Support
                </h4>
                <div style={{ fontSize: '2.25rem', color: 'var(--lf-deep-navy)', marginTop: '1rem' }}>🌐</div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Accordion Section */}
        <section
          style={{
            maxWidth: '800px',
            margin: '0 auto',
            padding: '4rem 1.5rem',
          }}
        >
          <h2
            className="headline-lg"
            style={{
              color: 'var(--lf-deep-navy)',
              textAlign: 'center',
              marginBottom: '2.5rem',
            }}
          >
            Frequently Asked Questions
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {faqs.map((faq, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #c3c7ca',
                  overflow: 'hidden',
                  transition: 'border-color 0.15s ease',
                }}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  style={{
                    width: '100%',
                    padding: '1.25rem 1.5rem',
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <span className="title-md" style={{ color: 'var(--lf-deep-navy)', fontSize: '1.1rem', margin: 0 }}>
                    {faq.question}
                  </span>
                  <span
                    style={{
                      transform: openFaq === index ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.25s ease',
                      fontSize: '1.2rem',
                      color: 'var(--lf-deep-navy)',
                    }}
                  >
                    ▼
                  </span>
                </button>

                {openFaq === index && (
                  <div
                    className="body-md"
                    style={{
                      padding: '0 1.5rem 1.25rem',
                      color: 'var(--lf-on-surface-variant)',
                      borderTop: '1px solid #f2f4f7',
                      paddingTop: '1rem',
                    }}
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
