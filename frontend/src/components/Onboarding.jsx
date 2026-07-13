import React, { useState } from 'react';
import { Badge } from '@astryxdesign/core/Badge';
import { Button } from '@astryxdesign/core/Button';
import { CheckboxInput } from '@astryxdesign/core/CheckboxInput';
import { Heading } from '@astryxdesign/core/Heading';
import { HStack, VStack } from '@astryxdesign/core/Layout';
import { SelectableCard } from '@astryxdesign/core/SelectableCard';
import { Text } from '@astryxdesign/core/Text';
import { ToggleButton, ToggleButtonGroup } from '@astryxdesign/core/ToggleButton';
import { apiFetch } from '../lib/api';

const LANGUAGES = [
  { id: 'Spanish', name: 'Spanish', flag: '🇪🇸' },
  { id: 'French', name: 'French', flag: '🇫🇷' },
  { id: 'German', name: 'German', flag: '🇩🇪' },
  { id: 'Japanese', name: 'Japanese', flag: '🇯🇵' },
];

const LEVELS = ['A1', 'A2', 'B1', 'B2'];

const TIME_COMMITS = [
  { id: 10, title: '10 min', label: 'Casual', desc: 'Light focus. Ideal for busy schedules.' },
  {
    id: 20,
    title: '20 min',
    label: 'Regular',
    desc: 'Steady progress. Highly recommended.',
    recommended: true,
  },
  {
    id: 30,
    title: '30 min',
    label: 'Dedicated',
    desc: 'Polyglot sprint. Immersive output focus.',
  },
];

const PREFERENCES = [
  {
    id: 'input-heavy',
    title: 'Input-Heavy (Krashen)',
    icon: '🎧📚',
    desc: 'Focuses heavily on reading and listening. Ratios: 60% Input, 20% SRS, 20% Output.',
  },
  {
    id: 'output-first',
    title: 'Output-First (Lewis)',
    icon: '🎤💬',
    desc: 'Early speaking focus. Speak from day one. Ratios: 30% Input, 20% SRS, 50% Output.',
  },
  {
    id: 'balanced',
    title: 'Balanced Path',
    icon: '⚖️🌊',
    desc: 'A harmonious split. Ratios: 40% Input, 30% SRS, 30% Output.',
  },
];

const GOAL_OPTIONS = [
  { id: 'travel', label: 'Travel & Culture ✈️' },
  { id: 'conversation', label: 'Conversation Practice 🗣️' },
  { id: 'exam', label: 'Exam Preparation 🎓' },
  { id: 'polyglot', label: 'Polyglot Journey 🗺️' },
];

export default function Onboarding({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    target_language: 'Spanish',
    native_language: 'English',
    current_level: 'A1',
    daily_commitment: 20,
    strategy_preference: 'input-heavy',
    goals: [],
  });

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
      const res = await apiFetch('/api/user/onboard', {
        method: 'POST',
        body: JSON.stringify({
          target_language: formData.target_language,
          native_language: formData.native_language,
          current_level: formData.current_level,
          daily_commitment: formData.daily_commitment,
          strategy_preference: formData.strategy_preference,
          goals: formData.goals,
        }),
      });
      if (res.ok) {
        const result = await res.json();
        setTimeout(() => {
          onComplete(result.user);
        }, 1500);
      } else {
        console.error('Failed to submit onboarding profile');
        onComplete(formData);
      }
    } catch (err) {
      console.error('Error submitting onboarding:', err);
      onComplete(formData);
    }
  };

  if (loading) {
    return (
      <div className="lf-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <div style={{ fontSize: '2.5rem', animation: 'float 2s ease-in-out infinite' }}>🌊</div>
        <Heading level={2}>Personalizing Your Flow...</Heading>
        <Text type="supporting" color="secondary" as="p" display="block">
          Calibrating content ratios and setting up your learning workspace.
        </Text>
      </div>
    );
  }

  return (
    <div className="lf-card" style={{ animation: 'fadeIn 0.4s ease-out' }}>
      <VStack gap={2} style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Heading level={1} justify="center">
          Construct Your Path
        </Heading>
        <Text type="supporting" color="secondary" display="block" justify="center">
          Step {currentStep} of 4
        </Text>
      </VStack>

      {currentStep === 1 && (
        <VStack gap={4}>
          <Heading level={3} color="secondary">
            Select Target Language
          </Heading>
          <div className="flag-grid">
            {LANGUAGES.map((lang) => (
              <SelectableCard
                key={lang.id}
                label={lang.name}
                isSelected={formData.target_language === lang.id}
                onChange={(selected) => {
                  if (selected) {
                    setFormData((prev) => ({ ...prev, target_language: lang.id }));
                  }
                }}
                padding={3}
              >
                <VStack gap={1}>
                  <Text size="2xl" display="block" justify="center">
                    {lang.flag}
                  </Text>
                  <Text type="label" display="block" justify="center">
                    {lang.name}
                  </Text>
                </VStack>
              </SelectableCard>
            ))}
          </div>

          <Heading level={3} color="secondary">
            Current Level
          </Heading>
          <ToggleButtonGroup
            label="Current level"
            type="single"
            value={formData.current_level}
            onChange={(value) => {
              if (value) {
                setFormData((prev) => ({ ...prev, current_level: value }));
              }
            }}
          >
            {LEVELS.map((level) => (
              <ToggleButton key={level} label={level} value={level} />
            ))}
          </ToggleButtonGroup>
        </VStack>
      )}

      {currentStep === 2 && (
        <VStack gap={4}>
          <Heading level={3} color="secondary">
            Daily Time Commitment
          </Heading>
          <div className="option-grid">
            {TIME_COMMITS.map((tc) => (
              <SelectableCard
                key={tc.id}
                label={tc.title}
                isSelected={formData.daily_commitment === tc.id}
                onChange={(selected) => {
                  if (selected) {
                    setFormData((prev) => ({ ...prev, daily_commitment: tc.id }));
                  }
                }}
              >
                <VStack gap={1}>
                  <HStack gap={2}>
                    <Text type="large" weight="semibold">
                      {tc.title}
                    </Text>
                    {tc.recommended && <Badge label="REC" variant="cyan" />}
                  </HStack>
                  <Text type="label">{tc.label}</Text>
                  <Text type="supporting" color="secondary" display="block">
                    {tc.desc}
                  </Text>
                </VStack>
              </SelectableCard>
            ))}
          </div>

          <div className="feedback-box">
            Pro tip: Consistent short sessions beat long irregular ones. 15–20 minutes daily is the
            sweet spot for learning retention.
          </div>
        </VStack>
      )}

      {currentStep === 3 && (
        <VStack gap={4}>
          <Heading level={3} color="secondary">
            Select Learning Style
          </Heading>
          <VStack gap={3}>
            {PREFERENCES.map((pref) => (
              <SelectableCard
                key={pref.id}
                label={pref.title}
                isSelected={formData.strategy_preference === pref.id}
                onChange={(selected) => {
                  if (selected) {
                    setFormData((prev) => ({ ...prev, strategy_preference: pref.id }));
                  }
                }}
              >
                <HStack gap={3}>
                  <Text size="2xl">{pref.icon}</Text>
                  <VStack gap={1}>
                    <Text type="large" weight="semibold" display="block">
                      {pref.title}
                    </Text>
                    <Text type="supporting" color="secondary" display="block">
                      {pref.desc}
                    </Text>
                  </VStack>
                </HStack>
              </SelectableCard>
            ))}
          </VStack>
        </VStack>
      )}

      {currentStep === 4 && (
        <VStack gap={4}>
          <Heading level={3} color="secondary">
            What is your primary goal?
          </Heading>
          <div className="option-grid">
            {GOAL_OPTIONS.map((goal) => (
              <SelectableCard
                key={goal.id}
                label={goal.label}
                isSelected={formData.goals.includes(goal.id)}
                onChange={(selected) => {
                  setFormData((prev) => {
                    const goals = selected
                      ? [...prev.goals, goal.id]
                      : prev.goals.filter((g) => g !== goal.id);
                    return { ...prev, goals };
                  });
                }}
              >
                <CheckboxInput
                  label={goal.label}
                  value={formData.goals.includes(goal.id)}
                  onChange={() => {}}
                  isReadOnly
                />
              </SelectableCard>
            ))}
          </div>

          <Heading level={3} color="secondary">
            Profile Summary
          </Heading>
          <div className="feedback-box">
            Target: {formData.target_language} ({formData.current_level})
            <br />
            Time: {formData.daily_commitment} mins/day
            <br />
            Methodology:{' '}
            {formData.strategy_preference === 'input-heavy'
              ? 'Input-Heavy (Krashen)'
              : formData.strategy_preference === 'output-first'
                ? 'Output-First (Lewis)'
                : 'Balanced Path'}
          </div>
        </VStack>
      )}

      <div className="btn-row">
        <Button
          label="Back"
          variant="secondary"
          onClick={handleBack}
          isDisabled={currentStep === 1}
        />
        <Button
          label={currentStep === 4 ? 'Create My Profile' : 'Continue'}
          variant="primary"
          onClick={handleNext}
        />
      </div>
    </div>
  );
}
