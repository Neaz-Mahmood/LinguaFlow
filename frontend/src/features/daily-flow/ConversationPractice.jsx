import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Banner } from '@astryxdesign/core/Banner';
import { Button } from '@astryxdesign/core/Button';
import { Heading } from '@astryxdesign/core/Heading';
import { HStack, VStack } from '@astryxdesign/core/Layout';
import { Text } from '@astryxdesign/core/Text';
import { TextArea } from '@astryxdesign/core/TextArea';
import { apiFetch } from '../../lib/api';

const PROCESSING = new Set(['assessment_queued', 'assessing']);
const POLL_DELAYS = [1200, 2000, 3200, 5000, 8000, 8000, 8000, 8000];

async function apiError(response, fallback) {
  const body = await response.text();
  try {
    const parsed = JSON.parse(body);
    return Array.isArray(parsed.message) ? parsed.message.join(', ') : parsed.message || fallback;
  } catch {
    return body || fallback;
  }
}

function Feedback({ session }) {
  const { t } = useTranslation();
  const feedback = session.feedback;
  const [mined, setMined] = useState(new Set());
  const [mining, setMining] = useState(null);
  const [error, setError] = useState('');

  const mine = async (correctionId) => {
    setMining(correctionId);
    setError('');
    try {
      const response = await apiFetch(
        `/api/conversation-sessions/${session.id}/corrections/${encodeURIComponent(correctionId)}/mine`,
        { method: 'POST' },
      );
      if (!response.ok) throw new Error(await apiError(response, t('conversation.mineFailed')));
      setMined((current) => new Set(current).add(correctionId));
    } catch (caught) {
      setError(caught.message);
    } finally {
      setMining(null);
    }
  };

  return (
    <VStack gap={4}>
      <Banner
        status="success"
        title={t('conversation.sessionEstimate', {
          cefr: feedback.estimatedCefr,
          score: feedback.overallScore,
        })}
        description={feedback.summary}
      />
      <VStack gap={2}>
        <Heading level={3}>{t('conversation.whatWorked')}</Heading>
        {feedback.strengths.map((strength) => (
          <section className="conversation-feedback-item" key={strength.title}>
            <Text type="label" display="block">{strength.title}</Text>
            <Text type="supporting" color="secondary" display="block">{strength.explanation}</Text>
            <Text type="supporting" display="block">“{strength.evidence.excerpt}”</Text>
          </section>
        ))}
      </VStack>

      <section className="conversation-score-grid" aria-label={t('conversation.skillScores')}>
        {Object.entries(feedback.dimensions).map(([name, dimension]) => (
          <section className="conversation-score" key={name}>
            <Text type="label" display="block">{name.replace(/([A-Z])/g, ' $1')}</Text>
            <Heading level={3}>{dimension.score}</Heading>
          </section>
        ))}
      </section>

      <VStack gap={2}>
        <Heading level={3}>{t('conversation.corrections')}</Heading>
        {feedback.corrections.length === 0 && (
          <Text type="supporting" color="secondary">{t('conversation.noCorrections')}</Text>
        )}
        {feedback.corrections.map((correction) => (
          <section className="conversation-feedback-item" key={correction.id}>
            <Text type="supporting" color="secondary" display="block">
              {t('conversation.original')}: {correction.originalText}
            </Text>
            <Text type="large" weight="semibold" display="block">
              {correction.correctedText}
            </Text>
            <Text display="block">{correction.translation}</Text>
            <Text type="supporting" color="secondary" display="block">
              {correction.explanation}
            </Text>
            <Button
              label={mined.has(correction.id) ? t('conversation.sentenceMined') : t('conversation.mineSentence')}
              variant="secondary"
              isDisabled={mined.has(correction.id)}
              isLoading={mining === correction.id}
              onClick={() => mine(correction.id)}
            />
          </section>
        ))}
      </VStack>

      {feedback.vocabularyUpgrades.length > 0 && (
        <VStack gap={2}>
          <Heading level={3}>{t('conversation.vocabUpgrades')}</Heading>
          {feedback.vocabularyUpgrades.map((upgrade, index) => (
            <section className="conversation-feedback-item" key={`${upgrade.sourceMessageId}-${index}`}>
              <Text type="large" weight="semibold" display="block">
                {upgrade.originalText} → {upgrade.replacement}
              </Text>
              <Text display="block">{upgrade.exampleSentence}</Text>
              <Text type="supporting" color="secondary" display="block">
                {upgrade.translation} · {upgrade.explanation}
              </Text>
            </section>
          ))}
        </VStack>
      )}

      <Banner status="info" title={t('conversation.nextFocus')} description={feedback.nextFocus} />
      <Text type="supporting" color="secondary" display="block">
        {t('conversation.disclaimer', { confidence: Math.round(feedback.confidence * 100) })}
      </Text>
      {error && <Banner status="error" title={t('conversation.miningFailed')} description={error} />}
    </VStack>
  );
}

export default function ConversationPractice({ onComplete }) {
  const { t } = useTranslation();
  const [session, setSession] = useState(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [error, setError] = useState('');
  const pollAttempt = useRef(0);
  const pollTimer = useRef(null);

  const languageLabel = (code) => {
    const key = `onboarding.languages.${code}`;
    const translated = t(key);
    return translated === key ? code : translated;
  };

  const refresh = useCallback(async (id) => {
    const response = await apiFetch(`/api/conversation-sessions/${id}`);
    if (!response.ok) throw new Error(await apiError(response, t('conversation.refreshFailed')));
    const next = await response.json();
    setSession(next);
    return next;
  }, [t]);

  useEffect(() => {
    let cancelled = false;
    const start = async () => {
      try {
        const response = await apiFetch('/api/conversation-sessions', { method: 'POST' });
        if (!response.ok) throw new Error(await apiError(response, t('conversation.startFailed')));
        const data = await response.json();
        if (!cancelled) setSession(data);
      } catch (caught) {
        if (!cancelled) setError(caught.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    start();
    return () => {
      cancelled = true;
      if (pollTimer.current) clearTimeout(pollTimer.current);
    };
  }, [t]);

  useEffect(() => {
    if (!session || !PROCESSING.has(session.status)) return;
    if (pollAttempt.current >= POLL_DELAYS.length) return;
    const delay = POLL_DELAYS[pollAttempt.current++];
    pollTimer.current = setTimeout(async () => {
      try {
        const next = await refresh(session.id);
        if (!PROCESSING.has(next.status)) pollAttempt.current = 0;
      } catch (caught) {
        setError(caught.message);
      }
    }, delay);
    return () => clearTimeout(pollTimer.current);
  }, [session, refresh]);

  const send = async () => {
    const text = input.trim();
    if (!text || sending || !session) return;
    setSending(true);
    setError('');
    const clientMessageId = crypto.randomUUID();
    try {
      const response = await apiFetch(`/api/conversation-sessions/${session.id}/messages`, {
        method: 'POST',
        body: JSON.stringify({ text, clientMessageId }),
      });
      if (!response.ok) throw new Error(await apiError(response, t('conversation.sendFailed')));
      const pair = await response.json();
      setSession((current) => ({
        ...current,
        messages: [...current.messages, pair.userMessage, pair.assistantMessage],
        learnerTurnCount: current.learnerTurnCount + 1,
      }));
      setInput('');
    } catch (caught) {
      setError(caught.message);
      await refresh(session.id).catch(() => {});
    } finally {
      setSending(false);
    }
  };

  const finalize = async () => {
    if (!session) return;
    setFinalizing(true);
    setError('');
    try {
      const response = await apiFetch(`/api/conversation-sessions/${session.id}/finalize`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error(await apiError(response, t('conversation.finalizeFailed')));
      pollAttempt.current = 0;
      await refresh(session.id);
    } catch (caught) {
      setError(caught.message);
      await refresh(session.id).catch(() => {});
    } finally {
      setFinalizing(false);
    }
  };

  if (loading) {
    return (
      <section className="lf-card">
        <Heading level={2}>{t('conversation.preparing')}</Heading>
      </section>
    );
  }
  if (!session) {
    return (
      <section className="lf-card">
        <Banner status="error" title={t('conversation.unavailable')} description={error} />
        <Button label={t('conversation.tryAgain')} variant="primary" onClick={() => window.location.reload()} />
      </section>
    );
  }

  const language = session.targetLanguage || 'Spanish';
  const active = session.status === 'active';
  const canSend = active && session.learnerTurnCount < 8;
  return (
    <section className="lf-card conversation-card">
      <VStack gap={4}>
        <VStack gap={1}>
          <Heading level={2}>{t('conversation.title', { language: languageLabel(language) })}</Heading>
          <Text type="supporting" color="secondary" display="block">
            {session.scenario?.title} · {session.cefrLevel} · {session.learnerTurnCount}/8 {t('conversation.replies')}
          </Text>
        </VStack>

        {error && <Banner status="error" title={t('conversation.somethingWrong')} description={error} />}

        {active && (
          <>
            <section className="conversation-chat" aria-live="polite">
              {session.messages.filter((message) => message.generationStatus !== 'failed').map((message) => (
                <article className={`conversation-bubble ${message.role}`} key={message.id}>
                  <Text type="label" color="secondary" display="block">
                    {message.role === 'learner' ? t('conversation.you') : t('conversation.companion')}
                  </Text>
                  <Text display="block">{message.content}</Text>
                </article>
              ))}
              {sending && (
                <article className="conversation-bubble assistant">
                  <Text type="supporting" color="secondary">{t('conversation.thinking')}</Text>
                </article>
              )}
            </section>
            <HStack gap={3} align="end">
              <TextArea
                label={t('conversation.yourReply', { language: languageLabel(language) })}
                value={input}
                onChange={setInput}
                placeholder={t('conversation.placeholder')}
                maxLength={500}
                rows={3}
                isDisabled={!canSend || sending}
                disabledMessage={session.learnerTurnCount >= 8 ? t('conversation.limitReached') : undefined}
              />
              <Button
                label={t('conversation.send')}
                variant="primary"
                onClick={send}
                isLoading={sending}
                isDisabled={!canSend || !input.trim() || input.length > 500}
              />
            </HStack>
            <HStack gap={3} justify="between">
              <Text type="supporting" color="secondary">
                {session.learnerTurnCount < 3
                  ? t('conversation.moreBeforeFeedback', { count: 3 - session.learnerTurnCount })
                  : t('conversation.canFinish')}
              </Text>
              <Button
                label={t('conversation.endFeedback')}
                variant="secondary"
                onClick={finalize}
                isLoading={finalizing}
                isDisabled={session.learnerTurnCount < 3 || sending}
              />
            </HStack>
          </>
        )}

        {PROCESSING.has(session.status) && (
          <VStack gap={3}>
            <Banner
              status="info"
              title={t('conversation.reportPreparing')}
              description={t('conversation.reportPreparingDesc')}
            />
            <Button label={t('conversation.checkNow')} variant="secondary" onClick={() => refresh(session.id)} />
          </VStack>
        )}

        {session.status === 'assessment_failed' && (
          <Banner
            status="error"
            title={t('conversation.feedbackFailed')}
            description={t('conversation.feedbackFailedDesc')}
            endContent={
              <Button
                label={t('conversation.retryAssessment')}
                variant="primary"
                onClick={finalize}
                isLoading={finalizing}
              />
            }
          />
        )}

        {session.status === 'completed' && (
          <>
            <Feedback session={session} />
            <HStack justify="end">
              <Button label={t('conversation.finishFlow')} variant="primary" onClick={onComplete} />
            </HStack>
          </>
        )}
      </VStack>
    </section>
  );
}
