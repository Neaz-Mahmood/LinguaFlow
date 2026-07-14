import { validateAndScoreFeedback } from './conversation-feedback';

const firstId = '11111111-1111-4111-8111-111111111111';
const secondId = '22222222-2222-4222-8222-222222222222';

function feedback() {
  const evidence = { messageId: firstId, excerpt: 'Yo fui al mercado' };
  return {
    summary: 'A useful short sample.',
    strengths: [
      {
        title: 'Clear meaning',
        explanation: 'The message is understandable.',
        evidence,
      },
    ],
    estimatedCefr: 'A2',
    confidence: 0.6,
    dimensions: {
      grammar: { score: 80, evidence: [evidence] },
      vocabulary: { score: 70, evidence: [evidence] },
      interaction: { score: 60, evidence: [evidence] },
      taskAchievement: { score: 90, evidence: [evidence] },
    },
    corrections: [
      {
        id: 'past-tense-1',
        sourceMessageId: firstId,
        originalText: 'Yo fui',
        correctedText: 'Fui',
        translation: 'I went',
        explanation: 'The subject pronoun can be omitted.',
        severity: 'low',
      },
      {
        id: 'hallucinated-source',
        sourceMessageId: secondId,
        originalText: 'texto inexistente',
        correctedText: 'otro texto',
        translation: 'other text',
        explanation: 'This must be removed.',
        severity: 'high',
      },
    ],
    vocabularyUpgrades: [],
    nextFocus: 'Practice narrating past events.',
  };
}

describe('validateAndScoreFeedback', () => {
  it('calculates the fixed weighted overall score', () => {
    const result = validateAndScoreFeedback(feedback(), [
      { id: firstId, content: 'Yo fui al mercado ayer.' },
    ]);

    expect(result.overallScore).toBe(74);
  });

  it('discards corrections that are not exact substrings of their learner source', () => {
    const result = validateAndScoreFeedback(feedback(), [
      { id: firstId, content: 'Yo fui al mercado ayer.' },
      { id: secondId, content: 'No contiene la frase inventada.' },
    ]);

    expect(result.corrections).toHaveLength(1);
    expect(result.corrections[0].id).toBe('past-tense-1');
  });

  it('accepts an error-free sample with no corrections', () => {
    const input = feedback();
    input.corrections = [];
    const result = validateAndScoreFeedback(input, [
      { id: firstId, content: 'Yo fui al mercado ayer.' },
    ]);

    expect(result.corrections).toEqual([]);
  });

  it('rejects malformed structured output', () => {
    expect(() =>
      validateAndScoreFeedback({ summary: 'incomplete' }, []),
    ).toThrow();
  });
});
