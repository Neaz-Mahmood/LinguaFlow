import React from 'react';
import { Button } from '@astryxdesign/core/Button';
import { Heading } from '@astryxdesign/core/Heading';
import { Text } from '@astryxdesign/core/Text';
import { VStack } from '@astryxdesign/core/Layout';

export default function FlowCompletion({ streakCount, shadowScore, onRestart }) {
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
        Today&apos;s Flow Complete!
      </Heading>

      <Text type="supporting" color="secondary" as="p" display="block" justify="center">
        Phenomenal work! You have finished all 4 steps of your daily sequential flow path.
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
          <Heading level={3}>{streakCount || 1} Day Streak</Heading>
          <Text type="supporting" color="secondary" display="block">
            Come back tomorrow to keep the flame alive!
          </Text>
        </VStack>
      </div>

      <div className="summary-stats" style={{ width: '100%' }}>
        <div className="stat-box">
          <div className="stat-num">{displayScore}%</div>
          <div className="stat-label">Shadowing Accuracy</div>
        </div>
        <div className="stat-box">
          <div className="stat-num">4/4</div>
          <div className="stat-label">Steps Completed</div>
        </div>
      </div>

      <div className="feedback-box" style={{ width: '100%', borderStyle: 'solid', textAlign: 'left' }}>
        <Heading level={4} color="secondary">
          Milestones Met
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
              Krashen&apos;s CI: Read interactive texts and mined keywords in context.
            </Text>
          </li>
          <li>
            <Text type="supporting" color="secondary" display="block">
              Lewis&apos; Output: Practiced writing production and active generation.
            </Text>
          </li>
          <li>
            <Text type="supporting" color="secondary" display="block">
              Arguelles Shadowing: Repeated native phrases and recorded pronunciation.
            </Text>
          </li>
        </ul>
      </div>

      <Button label="Restart Daily Flow" variant="primary" onClick={onRestart} />
    </div>
  );
}
