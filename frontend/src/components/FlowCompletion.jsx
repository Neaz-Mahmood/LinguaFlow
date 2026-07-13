import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@astryxdesign/core/Button';
import { Heading } from '@astryxdesign/core/Heading';
import { Text } from '@astryxdesign/core/Text';
import { VStack } from '@astryxdesign/core/Layout';

export default function FlowCompletion({ streakCount, shadowScore, onRestart }) {
  const { t } = useTranslation();
  const displayScore = shadowScore > 0 ? shadowScore : 85;

  return (
    <div
      className="lf-card summary-container"
      style={{ animation: 'fadeIn 0.5s ease-out' }}
    >
      <div className="summary-icon" style={{ fontSize: '5rem', animation: 'float 2.5s ease-in-out infinite' }}>
        🔥
      </div>

      <Heading level={1} type="display-2" justify="center">
        {t('completion.title')}
      </Heading>

      <Text type="supporting" color="secondary" as="p" display="block" justify="center">
        {t('completion.subtitle')}
      </Text>

      <div
        className="feedback-box"
        style={{
          width: '100%',
          maxWidth: 350,
          textAlign: 'center',
          borderStyle: 'solid',
          borderColor: 'var(--color-border-cyan)',
        }}
      >
        <VStack gap={1}>
          <Text size="3xl" display="block">
            ⚡
          </Text>
          <Heading level={3}>{t('completion.dayStreak', { count: streakCount || 1 })}</Heading>
          <Text type="supporting" color="secondary" display="block">
            {t('completion.comeBack')}
          </Text>
        </VStack>
      </div>

      <div className="summary-stats" style={{ width: '100%' }}>
        <div className="stat-box">
          <div className="stat-num">{displayScore}%</div>
          <div className="stat-label">{t('completion.shadowingAccuracy')}</div>
        </div>
        <div className="stat-box">
          <div className="stat-num">4/4</div>
          <div className="stat-label">{t('completion.stepsCompleted')}</div>
        </div>
      </div>

      <div className="feedback-box" style={{ width: '100%', borderStyle: 'solid', textAlign: 'left' }}>
        <Heading level={4} color="secondary">
          {t('completion.milestones')}
        </Heading>
        <ul
          style={{
            listStyleType: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            marginTop: '0.75rem',
          }}
        >
          <li>
            <Text type="supporting" color="secondary" display="block">
              {t('completion.milestoneCi')}
            </Text>
          </li>
          <li>
            <Text type="supporting" color="secondary" display="block">
              {t('completion.milestoneOutput')}
            </Text>
          </li>
          <li>
            <Text type="supporting" color="secondary" display="block">
              {t('completion.milestoneShadow')}
            </Text>
          </li>
        </ul>
      </div>

      <Button label={t('completion.restart')} variant="primary" onClick={onRestart} />
    </div>
  );
}
