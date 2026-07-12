import React, { useState } from 'react';
import { apiFetch } from '../lib/api';

const LANGUAGES = [
  { id: "Spanish", name: "Spanish", flag: "🇪🇸" },
  { id: "French", name: "French", flag: "🇫🇷" },
  { id: "German", name: "German", flag: "🇩🇪" },
  { id: "Japanese", name: "Japanese", flag: "🇯🇵" }
];

const LEVELS = ["A1", "A2", "B1", "B2"];

const TIME_COMMITS = [
  { id: 10, title: "10 min", label: "Casual", desc: "Light focus. Ideal for busy schedules." },
  { id: 20, title: "20 min", label: "Regular", desc: "Steady progress. Highly recommended.", recommended: true },
  { id: 30, title: "30 min", label: "Dedicated", desc: "Polyglot sprint. Immersive output focus." }
];

const PREFERENCES = [
  { 
    id: "input-heavy", 
    title: "Input-Heavy (Krashen)", 
    icon: "🎧📚", 
    desc: "Focuses heavily on reading and listening. Ratios: 60% Input, 20% SRS, 20% Output." 
  },
  { 
    id: "output-first", 
    title: "Output-First (Lewis)", 
    icon: "🎤💬", 
    desc: "Early speaking focus. Speak from day one. Ratios: 30% Input, 20% SRS, 50% Output." 
  },
  { 
    id: "balanced", 
    title: "Balanced Path", 
    icon: "⚖️🌊", 
    desc: "A harmonious split. Ratios: 40% Input, 30% SRS, 30% Output." 
  }
];

const GOAL_OPTIONS = [
  { id: "travel", label: "Travel & Culture ✈️" },
  { id: "conversation", label: "Conversation Practice 🗣️" },
  { id: "exam", label: "Exam Preparation 🎓" },
  { id: "polyglot", label: "Polyglot Journey 🗺️" }
];

export default function Onboarding({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    target_language: "Spanish",
    native_language: "English",
    current_level: "A1",
    daily_commitment: 20,
    strategy_preference: "input-heavy",
    goals: []
  });

  const handleSelectLanguage = (langId) => {
    setFormData(prev => ({ ...prev, target_language: langId }));
  };

  const handleSelectLevel = (level) => {
    setFormData(prev => ({ ...prev, current_level: level }));
  };

  const handleSelectTime = (time) => {
    setFormData(prev => ({ ...prev, daily_commitment: time }));
  };

  const handleSelectPref = (prefId) => {
    setFormData(prev => ({ ...prev, strategy_preference: prefId }));
  };

  const handleToggleGoal = (goalId) => {
    setFormData(prev => {
      const goals = prev.goals.includes(goalId)
        ? prev.goals.filter(g => g !== goalId)
        : [...prev.goals, goalId];
      return { ...prev, goals };
    });
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      submitOnboarding();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const submitOnboarding = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/user/onboard", {
        method: "POST",
        body: JSON.stringify({
          target_language: formData.target_language,
          native_language: formData.native_language,
          current_level: formData.current_level,
          daily_commitment: formData.daily_commitment,
          strategy_preference: formData.strategy_preference,
          goals: formData.goals
        })
      });
      if (res.ok) {
        const result = await res.json();
        // Give a slight simulated delay for premium loader experience
        setTimeout(() => {
          onComplete(result.user);
        }, 1500);
      } else {
        console.error("Failed to submit onboarding profile");
        onComplete(formData);
      }
    } catch (err) {
      console.error("Error submitting onboarding:", err);
      onComplete(formData);
    }
  };

  if (loading) {
    return (
      <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', textAlign: 'center' }}>
        <div className="logo" style={{ fontSize: '2.5rem', animation: 'float 2s ease-in-out infinite' }}>🌊</div>
        <h2 style={{ fontFamily: 'var(--font-display)', marginTop: '1.5rem', fontSize: '1.5rem' }}>Personalizing Your Flow...</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem', maxWidth: '300px' }}>
          Calibrating content ratios and setting up your learning workspace.
        </p>
      </div>
    );
  }

  return (
    <div className="card" style={{ animation: 'fadeIn 0.4s ease-out' }}>
      <h1 className="onboarding-title">Construct Your Path</h1>
      <p className="onboarding-subtitle">Step {currentStep} of 4</p>

      {/* STEP 1: TARGET LANGUAGE & LEVEL */}
      {currentStep === 1 && (
        <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '1rem', color: 'var(--text-secondary)' }}>Select Target Language</h3>
          <div className="flag-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '2rem' }}>
            {LANGUAGES.map(lang => (
              <div
                key={lang.id}
                className={`option-card ${formData.target_language === lang.id ? 'selected' : ''}`}
                onClick={() => handleSelectLanguage(lang.id)}
                style={{ alignItems: 'center', padding: '1rem' }}
              >
                <span style={{ fontSize: '2rem' }}>{lang.flag}</span>
                <span style={{ fontSize: '0.85rem', fontWeight: '500', marginTop: '0.25rem' }}>{lang.name}</span>
              </div>
            ))}
          </div>

          <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '1rem', color: 'var(--text-secondary)' }}>Current Level</h3>
          <div className="segmented-control" style={{ display: 'flex', background: 'var(--bg-secondary)', padding: '4px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', gap: '2px' }}>
            {LEVELS.map(level => (
              <button
                key={level}
                type="button"
                className={`segmented-btn ${formData.current_level === level ? 'active' : ''}`}
                onClick={() => handleSelectLevel(level)}
                style={{
                  flex: 1,
                  background: formData.current_level === level ? 'var(--accent-primary)' : 'transparent',
                  border: 'none',
                  color: formData.current_level === level ? 'var(--text-primary)' : 'var(--text-secondary)',
                  padding: '0.6rem',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'var(--transition-fast)'
                }}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: TIME COMMITMENT */}
      {currentStep === 2 && (
        <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>Daily Time Commitment</h3>
          <div className="option-grid">
            {TIME_COMMITS.map(tc => (
              <div
                key={tc.id}
                className={`option-card ${formData.daily_commitment === tc.id ? 'selected' : ''}`}
                onClick={() => handleSelectTime(tc.id)}
              >
                <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', width: '100%' }}>
                  <div className="option-card-title">{tc.title}</div>
                  {tc.recommended && (
                    <span style={{ fontSize: '0.65rem', background: 'var(--accent-secondary)', color: 'var(--bg-primary)', padding: '0.2rem 0.5rem', borderRadius: '20px', fontWeight: '700', marginLeft: 'auto' }}>
                      REC
                    </span>
                  )}
                </div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>{tc.label}</span>
                <div className="option-card-desc" style={{ marginTop: '0.25rem' }}>{tc.desc}</div>
              </div>
            ))}
          </div>

          <div className="feedback-box" style={{ marginTop: '1.5rem', borderLeft: '3px solid var(--accent-secondary)' }}>
            💡 **Pro Tip**: Consistent short sessions beat long irregular ones. 15–20 minutes daily is the sweet spot for learning retention.
          </div>
        </div>
      )}

      {/* STEP 3: PREFERENCE METHODOLOGY */}
      {currentStep === 3 && (
        <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>Select Learning Style</h3>
          <div className="option-grid" style={{ gridTemplateColumns: '1fr' }}>
            {PREFERENCES.map(pref => (
              <div
                key={pref.id}
                className={`option-card ${formData.strategy_preference === pref.id ? 'selected' : ''}`}
                onClick={() => handleSelectPref(pref.id)}
                style={{ flexDirection: 'row', gap: '1rem', alignItems: 'center', padding: '1.25rem' }}
              >
                <span style={{ fontSize: '2.2rem' }}>{pref.icon}</span>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div className="option-card-title">{pref.title}</div>
                  <div className="option-card-desc">{pref.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 4: GOALS & CONFIRMATION */}
      {currentStep === 4 && (
        <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '1rem', color: 'var(--text-secondary)' }}>What is your primary goal?</h3>
          <div className="option-grid" style={{ marginBottom: '2rem' }}>
            {GOAL_OPTIONS.map(goal => (
              <div
                key={goal.id}
                className={`option-card ${formData.goals.includes(goal.id) ? 'selected' : ''}`}
                onClick={() => handleToggleGoal(goal.id)}
                style={{ padding: '1rem', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    checked={formData.goals.includes(goal.id)}
                    onChange={() => {}} // handled by div click
                    style={{ accentColor: 'var(--accent-secondary)' }}
                  />
                  <span style={{ fontSize: '0.95rem', fontWeight: '500' }}>{goal.label}</span>
                </div>
              </div>
            ))}
          </div>

          <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Profile Summary</h3>
          <div className="feedback-box" style={{ background: 'var(--bg-secondary)', fontSize: '0.85rem' }}>
            🌐 **Target**: {formData.target_language} ({formData.current_level})<br />
            ⏳ **Time**: {formData.daily_commitment} mins/day<br />
            🧠 **Methodology**: {formData.strategy_preference === 'input-heavy' ? 'Input-Heavy (Krashen)' : formData.strategy_preference === 'output-first' ? 'Output-First (Lewis)' : 'Balanced Path'}
          </div>
        </div>
      )}

      {/* FOOTER NAV BUTTONS */}
      <div className="btn-row">
        <button
          className="btn btn-secondary"
          onClick={handleBack}
          disabled={currentStep === 1}
          style={{ visibility: currentStep === 1 ? 'hidden' : 'visible' }}
        >
          Back
        </button>

        <button
          className="btn btn-primary"
          onClick={handleNext}
        >
          {currentStep === 4 ? "Create My Profile" : "Continue"}
        </button>
      </div>
    </div>
  );
}
