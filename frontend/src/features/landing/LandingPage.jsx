import Footer from '../../components/layout/Footer';
import Navbar from '../../components/layout/Navbar';

export default function LandingPage({
  onStartLearning,
  onNavigateToSignIn,
  onNavigateToSignUp,
  onNavigateToPricing,
}) {
  const testimonials = [
    {
      name: 'Sarah Jenkins',
      target: 'Learning French',
      quote:
        "I've tried every app, but LinguistAI is the only one that actually got me talking. Lumi is like a friend who never gets tired of my mistakes.",
    },
    {
      name: 'Marcus Chen',
      target: 'Learning Mandarin',
      quote:
        'The Neural Vocabulary Lab is a game changer. It knows exactly which words I struggle with and brings them back at the perfect time.',
    },
    {
      name: 'Elena Rodriguez',
      target: 'Learning Spanish',
      quote:
        'I used LinguistAI for 3 months before a business trip to Madrid. I was shocked at how well I could handle meetings and dinner conversations!',
    },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--lf-background-faint)' }}>
      {/* Navbar */}
      <Navbar
        onNavigateToSignIn={onNavigateToSignIn}
        onNavigateToSignUp={onNavigateToSignUp}
        onNavigateToPricing={onNavigateToPricing}
        isLoggedIn={false}
      />

      <main style={{ flex: 1 }}>
        {/* Hero Section */}
        <section
          style={{
            padding: '4rem 1.5rem 5rem',
            maxWidth: '1200px',
            margin: '0 auto',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3rem',
              alignItems: 'center',
            }}
          >
            {/* Left Content */}
            <div>
              <h1
                className="display-lg"
                style={{
                  color: 'var(--lf-deep-navy)',
                  fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
                  margin: '0 0 1.25rem 0',
                  lineHeight: 1.15,
                }}
              >
                Master Any Language with Your AI Conversation Partner
              </h1>
              <p
                className="body-lg"
                style={{
                  color: 'var(--lf-subtle-gray)',
                  margin: '0 0 2rem 0',
                  maxWidth: '520px',
                }}
              >
                LinguistAI adapts to your level, interests, and schedule. Practice naturally with Lumi, our context-aware AI tutor designed for fluency.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
                <button
                  type="button"
                  onClick={onStartLearning || onNavigateToSignUp}
                  style={{
                    backgroundColor: 'var(--lf-deep-navy)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.85rem 1.85rem',
                    fontFamily: 'var(--font-family-body)',
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(28, 43, 51, 0.15)',
                    transition: 'opacity 0.15s ease',
                  }}
                >
                  Start Learning for Free
                </button>
                <button
                  type="button"
                  onClick={onNavigateToPricing}
                  style={{
                    border: '1px solid var(--lf-subtle-gray)',
                    backgroundColor: '#ffffff',
                    color: 'var(--lf-deep-navy)',
                    borderRadius: '8px',
                    padding: '0.85rem 1.85rem',
                    fontFamily: 'var(--font-family-body)',
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  How it Works
                </button>
              </div>

              {/* Learner Avatars & Social Proof */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', marginStyle: '-0.5rem' }}>
                  {['🌐', '🎓', '🗣️'].map((emoji, idx) => (
                    <div
                      key={idx}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: '#ffffff',
                        border: '2px solid #ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.1rem',
                        marginLeft: idx > 0 ? '-10px' : 0,
                        boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                      }}
                    >
                      {emoji}
                    </div>
                  ))}
                </div>
                <span className="label-md" style={{ color: 'var(--lf-deep-navy)', fontWeight: 700, fontSize: '0.9rem' }}>
                  Join 50,000+ active learners
                </span>
              </div>
            </div>

            {/* Right AI Chat Card Mockup */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #c3c7ca',
                  padding: '1.75rem',
                  boxShadow: '0 12px 32px rgba(28, 43, 51, 0.1)',
                  transform: 'rotate(1deg)',
                  transition: 'transform 0.3s ease',
                }}
              >
                {/* Chat Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingBottom: '1rem', borderBottom: '1px solid #e0e3e6', marginBottom: '1.25rem' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: 'var(--lf-primary-fixed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.35rem' }}>
                    🤖
                  </div>
                  <div>
                    <h4 className="title-md" style={{ color: 'var(--lf-deep-navy)', margin: 0, fontWeight: 600, fontSize: '1.1rem' }}>
                      Lumi
                    </h4>
                    <span className="label-sm" style={{ color: '#2e7d32', fontWeight: 600, fontSize: '0.75rem' }}>
                      ● Active Now
                    </span>
                  </div>
                </div>

                {/* Chat Messages */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: '260px' }}>
                  <div style={{ alignSelf: 'flex-start', maxWidth: '85%', backgroundColor: 'var(--lf-surface-container-low)', padding: '0.85rem 1rem', borderRadius: '12px', borderTopLeftRadius: '2px' }}>
                    <p className="body-md" style={{ margin: 0, color: 'var(--lf-deep-navy)' }}>
                      ¡Hola! ¿Cómo estuvo tu fin de semana?
                    </p>
                    <span className="label-sm" style={{ fontSize: '0.65rem', color: 'var(--lf-subtle-gray)', display: 'block', marginTop: '0.35rem' }}>
                      Lumi • 10:02 AM
                    </span>
                  </div>

                  <div style={{ alignSelf: 'flex-end', maxWidth: '85%', backgroundColor: 'var(--lf-deep-navy)', color: '#ffffff', padding: '0.85rem 1rem', borderRadius: '12px', borderTopRightRadius: '2px' }}>
                    <p className="body-md" style={{ margin: 0, color: '#ffffff' }}>
                      Fue muy bien. Fui a el parque.
                    </p>
                    <span className="label-sm" style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.7)', display: 'block', marginTop: '0.35rem', textAlign: 'right' }}>
                      You • 10:03 AM
                    </span>
                  </div>

                  <div style={{ alignSelf: 'flex-start', maxWidth: '88%', backgroundColor: 'var(--lf-primary-fixed)', padding: '0.85rem 1rem', borderRadius: '12px', borderLeft: '4px solid var(--lf-deep-navy)' }}>
                    <p className="body-md" style={{ margin: '0 0 0.25rem 0', fontWeight: 700, color: 'var(--lf-deep-navy)' }}>
                      💡 Quick Tip:
                    </p>
                    <p className="body-md" style={{ margin: 0, color: 'var(--lf-deep-navy)', fontSize: '0.9rem' }}>
                      In Spanish, we usually say "<strong>al</strong>" instead of "a el". Try: "Fui <strong>al</strong> parque". Your sentence was almost perfect!
                    </p>
                  </div>
                </div>

                {/* Input Bar Mockup */}
                <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: 'var(--lf-background-faint)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #c3c7ca' }}>
                  <span style={{ color: 'var(--lf-subtle-gray)' }}>🎙️</span>
                  <span className="body-md" style={{ flex: 1, color: 'var(--lf-subtle-gray)', fontSize: '0.9rem' }}>
                    Type your response...
                  </span>
                  <span style={{ color: 'var(--lf-deep-navy)', fontWeight: 'bold' }}>➤</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Value Proposition Section */}
        <section style={{ backgroundColor: '#ffffff', padding: '5rem 1.5rem' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <h2 className="headline-lg" style={{ color: 'var(--lf-deep-navy)', margin: '0 0 0.75rem 0' }}>
                Why Learn with LinguistAI?
              </h2>
              <p className="body-lg" style={{ color: 'var(--lf-subtle-gray)', maxWidth: '600px', margin: '0 auto' }}>
                Our science-backed approach combines conversational artificial intelligence with pedagogical excellence.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              {/* Feature 1 */}
              <div style={{ backgroundColor: 'var(--lf-background-faint)', padding: '2rem', borderRadius: '16px', border: '1px solid #c3c7ca' }}>
                <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--lf-deep-navy)', color: '#ffffff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '1.25rem' }}>
                  💬
                </div>
                <h3 className="title-md" style={{ color: 'var(--lf-deep-navy)', margin: '0 0 0.75rem 0', fontWeight: 600 }}>
                  Real-time AI Tutoring
                </h3>
                <p className="body-md" style={{ color: 'var(--lf-subtle-gray)', margin: 0 }}>
                  Practice speaking 24/7 with context-aware AI that understands nuances, dialects, and slang like a native speaker.
                </p>
              </div>

              {/* Feature 2 */}
              <div style={{ backgroundColor: 'var(--lf-background-faint)', padding: '2rem', borderRadius: '16px', border: '1px solid #c3c7ca' }}>
                <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--lf-deep-navy)', color: '#ffffff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '1.25rem' }}>
                  🧠
                </div>
                <h3 className="title-md" style={{ color: 'var(--lf-deep-navy)', margin: '0 0 0.75rem 0', fontWeight: 600 }}>
                  Neural Vocabulary Lab
                </h3>
                <p className="body-md" style={{ color: 'var(--lf-subtle-gray)', margin: 0 }}>
                  Predictive word learning based on your progress. We identify gaps in your knowledge before you even realize they're there.
                </p>
              </div>

              {/* Feature 3 */}
              <div style={{ backgroundColor: 'var(--lf-background-faint)', padding: '2rem', borderRadius: '16px', border: '1px solid #c3c7ca' }}>
                <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--lf-deep-navy)', color: '#ffffff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '1.25rem' }}>
                  📦
                </div>
                <h3 className="title-md" style={{ color: 'var(--lf-deep-navy)', margin: '0 0 0.75rem 0', fontWeight: 600 }}>
                  Flashcard Mastery
                </h3>
                <p className="body-md" style={{ color: 'var(--lf-subtle-gray)', margin: 0 }}>
                  Scientific repetition schedules optimized for long-term retention. Never forget a word you've learned again.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Spotlight "Meet Lumi" Section */}
        <section style={{ backgroundColor: 'var(--lf-primary-container)', color: '#ffffff', padding: '5rem 1.5rem' }}>
          <div
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3rem',
              alignItems: 'center',
            }}
          >
            <div>
              <h2 className="display-lg" style={{ color: '#ffffff', margin: '0 0 1.25rem 0', fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
                Meet Lumi, Your Personal Linguist.
              </h2>
              <p className="body-lg" style={{ color: 'var(--lf-on-primary-container)', margin: '0 0 2rem 0' }}>
                Lumi isn't just a chatbot. Lumi is a sophisticated neural agent trained on millions of real-world conversations to provide instant, encouraging, and accurate feedback.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.05rem' }}>
                  <span style={{ color: 'var(--lf-inverse-primary)', fontWeight: 'bold' }}>✓</span>
                  <span>Natural, flowing dialogue</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.05rem' }}>
                  <span style={{ color: 'var(--lf-inverse-primary)', fontWeight: 'bold' }}>✓</span>
                  <span>Gentle grammar corrections</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.05rem' }}>
                  <span style={{ color: 'var(--lf-inverse-primary)', fontWeight: 'bold' }}>✓</span>
                  <span>Personalized interest-based topics</span>
                </li>
              </ul>
            </div>

            {/* Spotlight Card */}
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '16px',
                padding: '2rem',
                backdropFilter: 'blur(12px)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '1.25rem' }}>✨</span>
                <span className="label-md" style={{ color: '#ffffff', letterSpacing: '0.1em', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                  Intelligent Correction
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '1rem', borderRadius: '8px' }}>
                  <p className="body-md" style={{ margin: '0 0 0.25rem 0', color: 'rgba(255,255,255,0.7)', fontStyle: 'italic', fontSize: '0.85rem' }}>
                    User:
                  </p>
                  <p className="body-md" style={{ margin: 0, color: '#ffffff' }}>
                    "I has lived in Berlin for two years."
                  </p>
                </div>
                <div style={{ backgroundColor: 'rgba(7, 22, 30, 0.6)', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid var(--lf-inverse-primary)' }}>
                  <p className="body-md" style={{ margin: '0 0 0.25rem 0', color: 'var(--lf-inverse-primary)', fontWeight: 700, fontSize: '0.85rem' }}>
                    Lumi:
                  </p>
                  <p className="body-md" style={{ margin: 0, color: '#ffffff', fontSize: '0.95rem' }}>
                    Close! Remember to use "<strong>have</strong>" for the first person. "I <strong>have</strong> lived in Berlin..." You're doing great!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section style={{ padding: '5rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 className="headline-lg" style={{ color: 'var(--lf-deep-navy)', margin: 0 }}>
              Loved by Language Learners
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {testimonials.map((t, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #c3c7ca',
                  padding: '2rem',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ color: '#ffb300', fontSize: '1.1rem', marginBottom: '1rem' }}>★★★★★</div>
                  <p className="body-md" style={{ color: 'var(--lf-deep-navy)', fontStyle: 'italic', margin: '0 0 1.5rem 0', lineHeight: 1.6 }}>
                    "{t.quote}"
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--lf-primary-fixed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--lf-deep-navy)' }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <h4 className="title-md" style={{ color: 'var(--lf-deep-navy)', margin: 0, fontSize: '0.95rem', fontWeight: 600 }}>
                      {t.name}
                    </h4>
                    <span className="label-sm" style={{ color: 'var(--lf-subtle-gray)', fontSize: '0.75rem' }}>
                      {t.target}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA Banner */}
        <section style={{ padding: '0 1.5rem 5rem', maxWidth: '1000px', margin: '0 auto' }}>
          <div
            style={{
              backgroundColor: 'var(--lf-deep-navy)',
              borderRadius: '24px',
              padding: '4rem 2rem',
              textAlign: 'center',
              color: '#ffffff',
              boxShadow: '0 12px 32px rgba(28, 43, 51, 0.15)',
            }}
          >
            <h2 className="display-lg" style={{ color: '#ffffff', margin: '0 0 1rem 0', fontSize: 'clamp(1.75rem, 4vw, 2.75rem)' }}>
              Start your journey to fluency today
            </h2>
            <p className="body-lg" style={{ color: 'var(--lf-on-primary-container)', maxWidth: '560px', margin: '0 auto 2.5rem' }}>
              Join thousands of people who have already broken the language barrier with the power of AI.
            </p>
            <button
              type="button"
              onClick={onStartLearning || onNavigateToSignUp}
              style={{
                backgroundColor: '#ffffff',
                color: 'var(--lf-deep-navy)',
                border: 'none',
                borderRadius: '9999px',
                padding: '0.9rem 2.5rem',
                fontFamily: 'var(--font-family-body)',
                fontSize: '1.05rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.15s ease',
              }}
            >
              Get Started
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
