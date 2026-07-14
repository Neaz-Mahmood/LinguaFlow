import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  AppState,
  StyleSheet,
  View,
} from 'react-native';
import * as Crypto from 'expo-crypto';
import Toast from 'react-native-toast-message';
import { Button, Card, Screen, Text, TextField } from '../../components/ui';
import {
  ConversationFeedback,
  ConversationSession,
} from '../../model/conversation';
import {
  createOrResumeConversation,
  finalizeConversation,
  getConversation,
  mineConversationCorrection,
  sendConversationMessage,
} from '../../lib/conversationService';
import { ColorTokens, radius, spacing, typography, useAppTheme } from '../../theme';

const PROCESSING = new Set<ConversationSession['status']>([
  'assessment_queued',
  'assessing',
]);
const POLL_DELAYS = [1200, 2000, 3200, 5000, 8000, 8000, 8000, 8000];

type NoticeProps = {
  tone: 'info' | 'success' | 'error';
  title: string;
  detail?: string;
  action?: React.ReactNode;
};

function Notice({ tone, title, detail, action }: NoticeProps) {
  const { colors } = useAppTheme();
  const toneColor = {
    info: colors.accent,
    success: colors.success,
    error: colors.error,
  }[tone];

  return (
    <View
      accessibilityRole={tone === 'error' ? 'alert' : 'summary'}
      style={[
        styles.notice,
        {
          borderColor: toneColor,
          backgroundColor: colors.backgroundMuted,
        },
      ]}
    >
      <Text variant="heading" style={styles.noticeTitle}>
        {title}
      </Text>
      {detail ? <Text variant="secondary">{detail}</Text> : null}
      {action ? <View style={styles.noticeAction}>{action}</View> : null}
    </View>
  );
}

function ScoreGrid({ feedback }: { feedback: ConversationFeedback }) {
  const { colors } = useAppTheme();
  const scores = [
    ['Grammar', feedback.dimensions.grammar.score],
    ['Vocabulary', feedback.dimensions.vocabulary.score],
    ['Interaction', feedback.dimensions.interaction.score],
    ['Task achievement', feedback.dimensions.taskAchievement.score],
  ] as const;

  return (
    <View style={styles.scoreGrid} accessibilityLabel="Skill scores">
      {scores.map(([label, score]) => (
        <View
          key={label}
          style={[
            styles.score,
            {
              borderColor: colors.border,
              backgroundColor: colors.backgroundMuted,
            },
          ]}
        >
          <Text variant="label" style={styles.scoreLabel}>
            {label}
          </Text>
          <Text variant="heading">{score}</Text>
        </View>
      ))}
    </View>
  );
}

function FeedbackView({ session }: { session: ConversationSession }) {
  const feedback = session.feedback;
  const { colors } = useAppTheme();
  const [miningId, setMiningId] = useState<string | null>(null);
  const [mined, setMined] = useState<Record<string, boolean>>({});

  if (!feedback) {
    return (
      <Notice
        tone="error"
        title="Feedback is unavailable"
        detail="The assessment completed without a readable report."
      />
    );
  }

  const mine = async (correctionId: string) => {
    setMiningId(correctionId);
    try {
      await mineConversationCorrection(session.id, correctionId);
      setMined((current) => ({ ...current, [correctionId]: true }));
      Toast.show({
        type: 'success',
        text1: 'Sentence added to review',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Could not mine sentence',
        text2: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setMiningId(null);
    }
  };

  return (
    <View style={styles.sectionStack}>
      <Notice
        tone="success"
        title={`Session estimate: ${feedback.estimatedCefr} · ${feedback.overallScore}/100`}
        detail={feedback.summary}
      />

      <Text variant="heading">What worked</Text>
      {feedback.strengths.map((strength, index) => (
        <View
          key={`${strength.title}-${index}`}
          style={[
            styles.feedbackItem,
            {
              borderColor: colors.border,
              backgroundColor: colors.backgroundMuted,
            },
          ]}
        >
          <Text variant="heading">{strength.title}</Text>
          <Text variant="secondary">{strength.explanation}</Text>
          <Text style={styles.evidence}>“{strength.evidence.excerpt}”</Text>
        </View>
      ))}

      <ScoreGrid feedback={feedback} />

      <Text variant="heading">High-value corrections</Text>
      {feedback.corrections.length === 0 ? (
        <Text variant="secondary">No reliable corrections in this sample.</Text>
      ) : null}
      {feedback.corrections.map((correction) => (
        <View
          key={correction.id}
          style={[
            styles.feedbackItem,
            {
              borderColor: colors.border,
              backgroundColor: colors.backgroundMuted,
            },
          ]}
        >
          <Text variant="label">Original</Text>
          <Text variant="secondary">{correction.originalText}</Text>
          <Text variant="label" style={styles.feedbackLabel}>
            Improved Spanish
          </Text>
          <Text variant="heading">{correction.correctedSpanish}</Text>
          <Text>{correction.translation}</Text>
          <Text variant="secondary">{correction.explanation}</Text>
          <Button
            label={mined[correction.id] ? 'Sentence mined' : 'Mine Sentence'}
            variant="secondary"
            isDisabled={Boolean(mined[correction.id])}
            isLoading={miningId === correction.id}
            onPress={() => void mine(correction.id)}
            style={styles.itemButton}
          />
        </View>
      ))}

      {feedback.vocabularyUpgrades.length > 0 ? (
        <>
          <Text variant="heading">Vocabulary upgrades</Text>
          {feedback.vocabularyUpgrades.map((upgrade, index) => (
            <View
              key={`${upgrade.sourceMessageId}-${index}`}
              style={[
                styles.feedbackItem,
                {
                  borderColor: colors.border,
                  backgroundColor: colors.backgroundMuted,
                },
              ]}
            >
              <Text variant="heading">
                {upgrade.originalText} → {upgrade.replacement}
              </Text>
              <Text>{upgrade.exampleSentence}</Text>
              <Text variant="secondary">{upgrade.translation}</Text>
              <Text variant="secondary">{upgrade.explanation}</Text>
            </View>
          ))}
        </>
      ) : null}

      <Notice tone="info" title="Next focus" detail={feedback.nextFocus} />
      <Text variant="secondary" style={styles.disclaimer}>
        This is an estimate from a short text chat, not a formal CEFR
        certification. It does not measure pronunciation or spoken fluency.
        Sampling confidence: {Math.round(feedback.confidence * 100)}%.
      </Text>
    </View>
  );
}

function Bubble({
  role,
  content,
  colors,
}: {
  role: 'learner' | 'assistant';
  content: string;
  colors: ColorTokens;
}) {
  const learner = role === 'learner';
  return (
    <View
      style={[
        styles.bubble,
        learner ? styles.learnerBubble : styles.assistantBubble,
        {
          borderColor: learner ? colors.borderEmphasized : colors.border,
          backgroundColor: learner ? colors.accentMuted : colors.backgroundCard,
        },
      ]}
    >
      <Text variant="label" style={styles.bubbleLabel}>
        {learner ? 'You' : 'Companion'}
      </Text>
      <Text>{content}</Text>
    </View>
  );
}

export default function SpanishConversationScreen() {
  const { colors } = useAppTheme();
  const [session, setSession] = useState<ConversationSession | null>(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [error, setError] = useState('');
  const pollAttempt = useRef(0);
  const pollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const refresh = useCallback(async (id: string) => {
    const next = await getConversation(id);
    setSession(next);
    return next;
  }, []);

  const start = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const next = await createOrResumeConversation();
      setSession(next);
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : 'Could not load conversation.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void start();
    return () => {
      if (pollTimer.current) clearTimeout(pollTimer.current);
    };
  }, [start]);

  useEffect(() => {
    if (!session) return;
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        void refresh(session.id).catch(() => undefined);
      }
    });
    return () => subscription.remove();
  }, [refresh, session?.id]);

  useEffect(() => {
    if (!session || !PROCESSING.has(session.status)) return;
    if (pollAttempt.current >= POLL_DELAYS.length) return;

    const delay = POLL_DELAYS[pollAttempt.current];
    pollAttempt.current += 1;
    pollTimer.current = setTimeout(() => {
      void refresh(session.id)
        .then((next) => {
          if (!PROCESSING.has(next.status)) pollAttempt.current = 0;
        })
        .catch((caught: unknown) => {
          setError(
            caught instanceof Error
              ? caught.message
              : 'Could not refresh assessment.',
          );
        });
    }, delay);

    return () => {
      if (pollTimer.current) clearTimeout(pollTimer.current);
    };
  }, [refresh, session]);

  const send = async () => {
    const text = input.trim();
    if (!session || !text || sending) return;

    setSending(true);
    setError('');
    try {
      const pair = await sendConversationMessage(
        session.id,
        text,
        Crypto.randomUUID(),
      );
      setSession((current) =>
        current
          ? {
              ...current,
              messages: [
                ...current.messages,
                pair.userMessage,
                pair.assistantMessage,
              ],
              learnerTurnCount: current.learnerTurnCount + 1,
            }
          : current,
      );
      setInput('');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Message failed.');
      await refresh(session.id).catch(() => undefined);
    } finally {
      setSending(false);
    }
  };

  const finalize = async () => {
    if (!session || finalizing) return;

    setFinalizing(true);
    setError('');
    try {
      await finalizeConversation(session.id);
      pollAttempt.current = 0;
      await refresh(session.id);
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : 'Could not request feedback.',
      );
      await refresh(session.id).catch(() => undefined);
    } finally {
      setFinalizing(false);
    }
  };

  if (loading) {
    return (
      <Screen style={styles.loadingScreen}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text variant="heading" style={styles.loadingText}>
          Preparing your Spanish conversation…
        </Text>
      </Screen>
    );
  }

  if (!session) {
    return (
      <Screen>
        <Card>
          <Notice
            tone="error"
            title="Conversation unavailable"
            detail={error}
            action={
              <Button
                label="Try again"
                variant="primary"
                onPress={() => void start()}
              />
            }
          />
        </Card>
      </Screen>
    );
  }

  const active = session.status === 'active';
  const canSend = active && session.learnerTurnCount < session.maxLearnerTurns;

  return (
    <Screen style={styles.screen}>
      <Card style={styles.card}>
        <Text variant="title">Spanish Conversation</Text>
        <Text variant="secondary" style={styles.subtitle}>
          {session.scenario.title} · {session.cefrLevel} ·{' '}
          {session.learnerTurnCount}/{session.maxLearnerTurns} replies
        </Text>

        {error ? (
          <Notice tone="error" title="Something went wrong" detail={error} />
        ) : null}

        {active ? (
          <>
            <View
              style={[
                styles.transcript,
                {
                  borderColor: colors.border,
                  backgroundColor: colors.backgroundMuted,
                },
              ]}
              accessibilityLiveRegion="polite"
            >
              {session.messages
                .filter((message) => message.generationStatus !== 'failed')
                .map((message) => (
                  <Bubble
                    key={message.id}
                    role={message.role}
                    content={message.content}
                    colors={colors}
                  />
                ))}
              {sending ? (
                <Bubble
                  role="assistant"
                  content="Pensando…"
                  colors={colors}
                />
              ) : null}
            </View>

            <TextField
              label="Your reply in Spanish"
              value={input}
              onChangeText={setInput}
              placeholder="Escribe tu respuesta…"
              maxLength={500}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              editable={canSend && !sending}
              style={styles.composer}
            />
            <Text variant="label" style={styles.counter}>
              {input.length}/500
            </Text>
            <Button
              label="Send"
              variant="primary"
              isLoading={sending}
              isDisabled={!canSend || input.trim().length === 0}
              onPress={() => void send()}
            />

            <Text variant="secondary" style={styles.turnHint}>
              {session.learnerTurnCount < 3
                ? `${3 - session.learnerTurnCount} more replies before feedback`
                : 'You can continue or finish for feedback.'}
            </Text>
            <Button
              label="End & Get Feedback"
              variant="secondary"
              isLoading={finalizing}
              isDisabled={session.learnerTurnCount < 3 || sending}
              onPress={() => void finalize()}
            />
          </>
        ) : null}

        {PROCESSING.has(session.status) ? (
          <Notice
            tone="info"
            title="Your coaching report is being prepared"
            detail="Your transcript is safely saved. You can leave and return while the critic evaluates it."
            action={
              <Button
                label="Check now"
                variant="secondary"
                onPress={() => void refresh(session.id)}
              />
            }
          />
        ) : null}

        {session.status === 'assessment_failed' ? (
          <Notice
            tone="error"
            title="Feedback could not be generated"
            detail="Your transcript and Daily Flow completion are safe. Retry when the provider is available."
            action={
              <Button
                label="Retry assessment"
                variant="primary"
                isLoading={finalizing}
                onPress={() => void finalize()}
              />
            }
          />
        ) : null}

        {session.status === 'completed' ? (
          <FeedbackView session={session} />
        ) : null}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingVertical: spacing[5],
  },
  loadingScreen: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: spacing[4],
    textAlign: 'center',
  },
  card: {
    width: '100%',
  },
  subtitle: {
    marginTop: spacing[1],
    marginBottom: spacing[5],
  },
  transcript: {
    borderWidth: 1,
    borderRadius: radius.element,
    padding: spacing[3],
    marginBottom: spacing[4],
  },
  bubble: {
    maxWidth: '88%',
    borderWidth: 1,
    borderRadius: radius.element,
    padding: spacing[3],
    marginBottom: spacing[3],
  },
  learnerBubble: {
    alignSelf: 'flex-end',
  },
  assistantBubble: {
    alignSelf: 'flex-start',
  },
  bubbleLabel: {
    marginBottom: spacing[1],
  },
  composer: {
    minHeight: spacing[16] + spacing[4],
    fontSize: typography.size.base,
  },
  counter: {
    textAlign: 'right',
    marginTop: -spacing[2],
    marginBottom: spacing[3],
  },
  turnHint: {
    marginTop: spacing[4],
    marginBottom: spacing[2],
    textAlign: 'center',
  },
  notice: {
    borderLeftWidth: spacing[1],
    borderRadius: radius.element,
    padding: spacing[4],
    marginBottom: spacing[4],
  },
  noticeTitle: {
    marginBottom: spacing[1],
  },
  noticeAction: {
    marginTop: spacing[3],
  },
  sectionStack: {
    marginTop: spacing[2],
  },
  feedbackItem: {
    borderWidth: 1,
    borderRadius: radius.element,
    padding: spacing[4],
    marginBottom: spacing[3],
  },
  feedbackLabel: {
    marginTop: spacing[3],
  },
  evidence: {
    marginTop: spacing[2],
    fontStyle: 'italic',
  },
  itemButton: {
    marginTop: spacing[3],
  },
  scoreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing[4],
  },
  score: {
    width: '48%',
    borderWidth: 1,
    borderRadius: radius.element,
    padding: spacing[3],
    marginBottom: spacing[3],
    alignItems: 'center',
  },
  scoreLabel: {
    textAlign: 'center',
    marginBottom: spacing[1],
  },
  disclaimer: {
    marginTop: spacing[2],
  },
});
