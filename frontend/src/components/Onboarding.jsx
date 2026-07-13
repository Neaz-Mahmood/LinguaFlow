import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@astryxdesign/core/Badge';
import { Button } from '@astryxdesign/core/Button';
import { CheckboxInput } from '@astryxdesign/core/CheckboxInput';
import { Heading } from '@astryxdesign/core/Heading';
import { HStack, VStack } from '@astryxdesign/core/Layout';
import { SelectableCard } from '@astryxdesign/core/SelectableCard';
import { Text } from '@astryxdesign/core/Text';
import { ToggleButton, ToggleButtonGroup } from '@astryxdesign/core/ToggleButton';
import { apiFetch } from '../lib/api';

const LANGUAGE_IDS = ['Spanish', 'French', 'German', 'Japanese'];
const LANGUAGE_FLAGS = {
  Spanish: '🇪🇸',
  French: '🇫🇷',
  German: '🇩🇪',
  Japanese: '🇯🇵',
};
const LEVELS = ['A1', 'A2', 'B1', 'B2'];
const TIME_IDS = [10, 20, 30];
const STRATEGY_IDS = ['input-heavy', 'output-first', 'balanced'];
const GOAL_IDS = ['travel', 'conversation', 'exam', 'polyglot'];

export default function Onboarding({ onComplete }) {
  const { t } = useTranslation();
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

  const strategyLabel = (id) => {
    if (id === 'input-heavy') return t('onboarding.strategies.inputHeavy');
    if (id === 'output-first') return t('onboarding.strategies.outputFirst');
    return t('onboarding.strategies.balanced');
  };

  const strategyDesc = (id) => {
    if (id === 'input-heavy') return t('onboarding.strategies.inputHeavyDesc');
    if (id === 'output-first') return t('onboarding.strategies.outputFirstDesc');
    return t('onboarding.strategies.balancedDesc');
  };

  const strategyIcon = (id) => {
    if (id === 'input-heavy') return '🎧📚';
    if (id === 'output-first') return '🎤💬';
    return '⚖️🌊';
  };

  const timeMeta = (id) => {
    if (id === 10) {
      return {
        title: t('onboarding.time.mins', { count: 10 }),
        label: t('onboarding.time.casual'),
        desc: t('onboarding.time.casualDesc'),
      };
    }
    if (id === 20) {
      return {
        title: t('onboarding.time.mins', { count: 20 }),
        label: t('onboarding.time.regular'),
        desc: t('onboarding.time.regularDesc'),
        recommended: true,
      };
    }
    return {
      title: t('onboarding.time.mins', { count: 30 }),
      label: t('onboarding.time.dedicated'),
      desc: t('onboarding.time.dedicatedDesc'),
    };
  };

  const goalLabel = (id) => t(`onboarding.goals.${id}`);

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
        <Heading level={2}>{t('onboarding.personalizing')}</Heading>
        <Text type="supporting" color="secondary" as="p" display="block">
          {t('onboarding.calibrating')}
        </Text>
      </div>
    );
  }

  return (
    <div className="lf-card" style={{ animation: 'fadeIn 0.4s ease-out' }}>
      <VStack gap={2} style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Heading level={1} justify="center">
          {t('onboarding.title')}
        </Heading>
        <Text type="supporting" color="secondary" display="block" justify="center">
          {t('onboarding.stepOf', { current: currentStep, total: 4 })}
        </Text>
      </VStack>

      {currentStep === 1 && (
        <VStack gap={4}>
          <Heading level={3} color="secondary">
            {t('onboarding.selectTargetLanguage')}
          </Heading>
          <div className="flag-grid">
            {LANGUAGE_IDS.map((langId) => (
              <SelectableCard
                key={langId}
                label={t(`onboarding.languages.${langId}`)}
                isSelected={formData.target_language === langId}
                onChange={(selected) => {
                  if (selected) {
                    setFormData((prev) => ({ ...prev, target_language: langId }));
                  }
                }}
                padding={3}
              >
                <VStack gap={1}>
                  <Text size="2xl" display="block" justify="center">
                    {LANGUAGE_FLAGS[langId]}
                  </Text>
                  <Text type="label" display="block" justify="center">
                    {t(`onboarding.languages.${langId}`)}
                  </Text>
                </VStack>
              </SelectableCard>
            ))}
          </div>

          <Heading level={3} color="secondary">
            {t('onboarding.currentLevel')}
          </Heading>
          <ToggleButtonGroup
            label={t('onboarding.currentLevel')}
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
            {t('onboarding.dailyCommitment')}
          </Heading>
          <div className="option-grid">
            {TIME_IDS.map((tcId) => {
              const tc = timeMeta(tcId);
              return (
                <SelectableCard
                  key={tcId}
                  label={tc.title}
                  isSelected={formData.daily_commitment === tcId}
                  onChange={(selected) => {
                    if (selected) {
                      setFormData((prev) => ({ ...prev, daily_commitment: tcId }));
                    }
                  }}
                >
                  <VStack gap={1}>
                    <HStack gap={2}>
                      <Text type="large" weight="semibold">
                        {tc.title}
                      </Text>
                      {tc.recommended && <Badge label={t('onboarding.rec')} variant="cyan" />}
                    </HStack>
                    <Text type="label">{tc.label}</Text>
                    <Text type="supporting" color="secondary" display="block">
                      {tc.desc}
                    </Text>
                  </VStack>
                </SelectableCard>
              );
            })}
          </div>

          <div className="feedback-box">{t('onboarding.proTip')}</div>
        </VStack>
      )}

      {currentStep === 3 && (
        <VStack gap={4}>
          <Heading level={3} color="secondary">
            {t('onboarding.selectLearningStyle')}
          </Heading>
          <VStack gap={3}>
            {STRATEGY_IDS.map((prefId) => (
              <SelectableCard
                key={prefId}
                label={strategyLabel(prefId)}
                isSelected={formData.strategy_preference === prefId}
                onChange={(selected) => {
                  if (selected) {
                    setFormData((prev) => ({ ...prev, strategy_preference: prefId }));
                  }
                }}
              >
                <HStack gap={3}>
                  <Text size="2xl">{strategyIcon(prefId)}</Text>
                  <VStack gap={1}>
                    <Text type="large" weight="semibold" display="block">
                      {strategyLabel(prefId)}
                    </Text>
                    <Text type="supporting" color="secondary" display="block">
                      {strategyDesc(prefId)}
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
            {t('onboarding.primaryGoal')}
          </Heading>
          <div className="option-grid">
            {GOAL_IDS.map((goalId) => (
              <SelectableCard
                key={goalId}
                label={goalLabel(goalId)}
                isSelected={formData.goals.includes(goalId)}
                onChange={(selected) => {
                  setFormData((prev) => {
                    const goals = selected
                      ? [...prev.goals, goalId]
                      : prev.goals.filter((g) => g !== goalId);
                    return { ...prev, goals };
                  });
                }}
              >
                <CheckboxInput
                  label={goalLabel(goalId)}
                  value={formData.goals.includes(goalId)}
                  onChange={() => {}}
                  isReadOnly
                />
              </SelectableCard>
            ))}
          </div>

          <Heading level={3} color="secondary">
            {t('onboarding.profileSummary')}
          </Heading>
          <div className="feedback-box">
            {t('onboarding.summaryTarget', {
              language: t(`onboarding.languages.${formData.target_language}`),
              level: formData.current_level,
            })}
            <br />
            {t('onboarding.summaryTime', { minutes: formData.daily_commitment })}
            <br />
            {t('onboarding.summaryMethod', {
              method: strategyLabel(formData.strategy_preference),
            })}
          </div>
        </VStack>
      )}

      <div className="btn-row">
        <Button
          label={t('common.back')}
          variant="secondary"
          onClick={handleBack}
          isDisabled={currentStep === 1}
        />
        <Button
          label={currentStep === 4 ? t('onboarding.createProfile') : t('common.continue')}
          variant="primary"
          onClick={handleNext}
        />
      </div>
    </div>
  );
}
