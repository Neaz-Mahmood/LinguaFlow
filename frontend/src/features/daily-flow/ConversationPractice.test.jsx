import React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { apiFetch } from '../../lib/api';
import ConversationPractice from './ConversationPractice';

vi.mock('../../lib/api', () => ({ apiFetch: vi.fn() }));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, opts = {}) => {
      const map = {
        'conversation.preparing': 'Preparing your conversation…',
        'conversation.title': `${opts.language || 'Spanish'} Conversation`,
        'conversation.replies': 'replies',
        'conversation.yourReply': `Your reply in ${opts.language || 'Spanish'}`,
        'conversation.placeholder': 'Type your reply…',
        'conversation.send': 'Send',
        'conversation.endFeedback': 'End & Get Feedback',
        'conversation.moreBeforeFeedback': `${opts.count} more replies before feedback`,
        'conversation.canFinish': 'You can continue or finish for feedback.',
        'conversation.limitReached': 'Eight-reply limit reached',
        'conversation.reportPreparing': 'Your coaching report is being prepared',
        'conversation.checkNow': 'Check now',
        'conversation.retryAssessment': 'Retry assessment',
        'conversation.sessionEstimate': `Session estimate: ${opts.cefr} · ${opts.score}/100`,
        'conversation.mineSentence': 'Mine Sentence',
        'conversation.sentenceMined': 'Sentence mined',
        'conversation.whatWorked': 'What worked',
        'conversation.skillScores': 'Skill scores',
        'conversation.corrections': 'High-value corrections',
        'conversation.noCorrections': 'No reliable corrections in this sample.',
        'conversation.original': 'Original',
        'conversation.nextFocus': 'Next focus',
        'conversation.disclaimer': `Sampling confidence: ${opts.confidence}%.`,
        'conversation.finishFlow': "Finish Today's Flow",
        'conversation.you': 'You',
        'conversation.companion': 'Companion',
        'conversation.thinking': 'Thinking…',
        'conversation.somethingWrong': 'Something went wrong',
        'conversation.unavailable': 'Conversation unavailable',
        'conversation.tryAgain': 'Try again',
        'conversation.feedbackFailed': 'Feedback could not be generated',
        'conversation.feedbackFailedDesc': 'Retry when available.',
        'conversation.reportPreparingDesc': 'You can leave and return.',
        'onboarding.languages.Spanish': 'Spanish',
        'onboarding.languages.French': 'French',
        'onboarding.languages.German': 'German',
        'onboarding.languages.Japanese': 'Japanese',
      };
      return map[key] || key;
    },
  }),
}));

const assistant = {
  id: '11111111-1111-4111-8111-111111111111',
  role: 'assistant',
  content: '¡Hola! ¿Qué quieres comprar?',
  generationStatus: 'persisted',
};
const learner = {
  id: '22222222-2222-4222-8222-222222222222',
  role: 'learner',
  content: 'Quiero comprar pan.',
  generationStatus: 'persisted',
};
const reply = {
  id: '44444444-4444-4444-8444-444444444444',
  role: 'assistant',
  content: 'Muy bien. ¿Qué tipo de pan prefieres?',
  generationStatus: 'persisted',
};

function session(overrides = {}) {
  return {
    id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    status: 'active',
    targetLanguage: 'Spanish',
    scenario: { title: 'En el mercado' },
    cefrLevel: 'A2',
    learnerTurnCount: 0,
    maxLearnerTurns: 8,
    messages: [assistant],
    feedback: null,
    ...overrides,
  };
}

function response(body, ok = true) {
  return {
    ok,
    status: ok ? 200 : 503,
    json: vi.fn().mockResolvedValue(body),
    text: vi.fn().mockResolvedValue(JSON.stringify(body)),
  };
}

function mockSession(body) {
  apiFetch.mockImplementation((path, options = {}) => {
    if (path.endsWith('/messages') && options.method === 'POST') {
      return Promise.resolve(
        response({
          userMessage: {
            ...learner,
            id: '55555555-5555-4555-8555-555555555555',
            content: 'También quiero queso.',
          },
          assistantMessage: reply,
        }),
      );
    }
    if (path.includes('/mine')) return Promise.resolve(response({ id: 9 }));
    if (path.endsWith('/finalize')) {
      return Promise.resolve(response({ status: 'assessment_queued' }));
    }
    return Promise.resolve(response(typeof body === 'function' ? body() : body));
  });
}

describe('ConversationPractice', () => {
  beforeEach(() => {
    mockSession(session());
  });

  afterEach(() => {
    cleanup();
    vi.clearAllTimers();
    vi.clearAllMocks();
  });

  it('creates or resumes a session and enables finalization only after three learner replies', async () => {
    mockSession(session({ learnerTurnCount: 2, messages: [assistant, learner] }));
    render(<ConversationPractice onComplete={vi.fn()} />);

    expect(await screen.findByText('¡Hola! ¿Qué quieres comprar?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'End & Get Feedback' })).toBeDisabled();

    mockSession(session({ learnerTurnCount: 3, messages: [assistant, learner, reply] }));
    // Re-create after three replies (resume path).
    cleanup();
    mockSession(session({ learnerTurnCount: 3, messages: [assistant, learner, reply] }));
    render(<ConversationPractice onComplete={vi.fn()} />);

    expect(await screen.findByText('Muy bien. ¿Qué tipo de pan prefieres?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'End & Get Feedback' })).toBeEnabled();
  });

  it('sends a learner message through the conversation API', async () => {
    mockSession(session({ learnerTurnCount: 2, messages: [assistant, learner] }));
    render(<ConversationPractice onComplete={vi.fn()} />);
    expect(await screen.findByText('¡Hola! ¿Qué quieres comprar?')).toBeInTheDocument();

    const textarea = screen.getByRole('textbox', { name: 'Your reply in Spanish' });
    fireEvent.change(textarea, { target: { value: 'También quiero queso.' } });
    fireEvent.click(screen.getByRole('button', { name: 'Send' }));

    await waitFor(() =>
      expect(apiFetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/messages$/),
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('También quiero queso.'),
        }),
      ),
    );
  });

  it('labels the UI with the session target language', async () => {
    mockSession(session({ targetLanguage: 'French' }));
    render(<ConversationPractice onComplete={vi.fn()} />);

    expect(await screen.findByText('French Conversation')).toBeInTheDocument();
    expect(screen.getByLabelText('Your reply in French')).toBeInTheDocument();
  });

  it('disables sending at the eight-reply cap', async () => {
    mockSession(session({ learnerTurnCount: 8 }));
    render(<ConversationPractice onComplete={vi.fn()} />);

    expect(await screen.findByText('Eight-reply limit reached')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'End & Get Feedback' })).toBeEnabled();
  });

  it('renders the reload-safe assessment processing state', async () => {
    mockSession(session({ status: 'assessing', learnerTurnCount: 3 }));
    render(<ConversationPractice onComplete={vi.fn()} />);

    expect(await screen.findByText('Your coaching report is being prepared')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Check now' })).toBeEnabled();
  });

  it('offers a retry after assessment failure', async () => {
    mockSession(session({ status: 'assessment_failed', learnerTurnCount: 3 }));
    render(<ConversationPractice onComplete={vi.fn()} />);

    const retry = await screen.findByRole('button', { name: 'Retry assessment' });
    fireEvent.click(retry);
    await waitFor(() =>
      expect(apiFetch).toHaveBeenCalledWith(
        expect.stringContaining('/finalize'),
        expect.objectContaining({ method: 'POST' }),
      ),
    );
  });

  it('renders feedback and mines a correction idempotently', async () => {
    const evidence = { messageId: learner.id, excerpt: learner.content };
    mockSession(
      session({
        status: 'completed',
        learnerTurnCount: 3,
        messages: [assistant, learner],
        feedback: {
          summary: 'Good short conversation.',
          estimatedCefr: 'A2',
          overallScore: 76,
          confidence: 0.65,
          strengths: [{ title: 'Clear intent', explanation: 'Easy to understand.', evidence }],
          dimensions: {
            grammar: { score: 75, evidence: [evidence] },
            vocabulary: { score: 70, evidence: [evidence] },
            interaction: { score: 80, evidence: [evidence] },
            taskAchievement: { score: 85, evidence: [evidence] },
          },
          corrections: [{
            id: 'article-1',
            sourceMessageId: learner.id,
            originalText: 'comprar pan',
            correctedText: 'comprar el pan',
            translation: 'to buy the bread',
            explanation: 'Use the article for this specific item.',
            severity: 'low',
          }],
          vocabularyUpgrades: [],
          nextFocus: 'Practice definite articles.',
        },
      }),
    );

    render(<ConversationPractice onComplete={vi.fn()} />);

    expect(await screen.findByText('Session estimate: A2 · 76/100')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Mine Sentence' }));
    expect(await screen.findByRole('button', { name: 'Sentence mined' })).toBeDisabled();
  });
});
