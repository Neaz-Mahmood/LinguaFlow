import { z } from 'zod';

const evidenceSchema = z.object({
  messageId: z.string().uuid(),
  excerpt: z.string().min(1),
});

const dimensionSchema = z.object({
  score: z.number().int().min(0).max(100),
  evidence: z.array(evidenceSchema).max(3),
});

export const conversationFeedbackSchema = z.object({
  summary: z.string().min(1),
  strengths: z
    .array(
      z.object({
        title: z.string().min(1),
        explanation: z.string().min(1),
        evidence: evidenceSchema,
      }),
    )
    .max(2),
  estimatedCefr: z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']),
  confidence: z.number().min(0).max(1),
  dimensions: z.object({
    grammar: dimensionSchema,
    vocabulary: dimensionSchema,
    interaction: dimensionSchema,
    taskAchievement: dimensionSchema,
  }),
  corrections: z
    .array(
      z.object({
        id: z.string().min(1),
        sourceMessageId: z.string().uuid(),
        originalText: z.string().min(1),
        correctedText: z.string().min(1),
        translation: z.string().min(1),
        explanation: z.string().min(1),
        severity: z.enum(['low', 'medium', 'high']),
      }),
    )
    .max(3),
  vocabularyUpgrades: z
    .array(
      z.object({
        sourceMessageId: z.string().uuid(),
        originalText: z.string().min(1),
        replacement: z.string().min(1),
        exampleSentence: z.string().min(1),
        translation: z.string().min(1),
        explanation: z.string().min(1),
      }),
    )
    .max(3),
  nextFocus: z.string().min(1),
});

export type ConversationFeedbackInput = z.infer<
  typeof conversationFeedbackSchema
>;
export type ConversationFeedbackV1 = ConversationFeedbackInput & {
  overallScore: number;
};

export const feedbackJsonSchema = {
  type: 'object',
  additionalProperties: false,
  required: [
    'summary',
    'strengths',
    'estimatedCefr',
    'confidence',
    'dimensions',
    'corrections',
    'vocabularyUpgrades',
    'nextFocus',
  ],
  properties: {
    summary: { type: 'string' },
    strengths: {
      type: 'array',
      maxItems: 2,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['title', 'explanation', 'evidence'],
        properties: {
          title: { type: 'string' },
          explanation: { type: 'string' },
          evidence: { $ref: '#/$defs/evidence' },
        },
      },
    },
    estimatedCefr: {
      type: 'string',
      enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
    },
    confidence: { type: 'number', minimum: 0, maximum: 1 },
    dimensions: {
      type: 'object',
      additionalProperties: false,
      required: ['grammar', 'vocabulary', 'interaction', 'taskAchievement'],
      properties: {
        grammar: { $ref: '#/$defs/dimension' },
        vocabulary: { $ref: '#/$defs/dimension' },
        interaction: { $ref: '#/$defs/dimension' },
        taskAchievement: { $ref: '#/$defs/dimension' },
      },
    },
    corrections: {
      type: 'array',
      maxItems: 3,
      items: {
        type: 'object',
        additionalProperties: false,
        required: [
          'id',
          'sourceMessageId',
          'originalText',
          'correctedText',
          'translation',
          'explanation',
          'severity',
        ],
        properties: {
          id: { type: 'string' },
          sourceMessageId: { type: 'string', format: 'uuid' },
          originalText: { type: 'string' },
          correctedText: { type: 'string' },
          translation: { type: 'string' },
          explanation: { type: 'string' },
          severity: { type: 'string', enum: ['low', 'medium', 'high'] },
        },
      },
    },
    vocabularyUpgrades: {
      type: 'array',
      maxItems: 3,
      items: {
        type: 'object',
        additionalProperties: false,
        required: [
          'sourceMessageId',
          'originalText',
          'replacement',
          'exampleSentence',
          'translation',
          'explanation',
        ],
        properties: {
          sourceMessageId: { type: 'string', format: 'uuid' },
          originalText: { type: 'string' },
          replacement: { type: 'string' },
          exampleSentence: { type: 'string' },
          translation: { type: 'string' },
          explanation: { type: 'string' },
        },
      },
    },
    nextFocus: { type: 'string' },
  },
  $defs: {
    evidence: {
      type: 'object',
      additionalProperties: false,
      required: ['messageId', 'excerpt'],
      properties: {
        messageId: { type: 'string', format: 'uuid' },
        excerpt: { type: 'string' },
      },
    },
    dimension: {
      type: 'object',
      additionalProperties: false,
      required: ['score', 'evidence'],
      properties: {
        score: { type: 'integer', minimum: 0, maximum: 100 },
        evidence: {
          type: 'array',
          maxItems: 3,
          items: { $ref: '#/$defs/evidence' },
        },
      },
    },
  },
} as const;

export function validateAndScoreFeedback(
  value: unknown,
  learnerMessages: Array<{ id: string; content: string }>,
): ConversationFeedbackV1 {
  const parsed = conversationFeedbackSchema.parse(value);
  const sources = new Map(
    learnerMessages.map((message) => [message.id, message.content]),
  );
  parsed.corrections = parsed.corrections.filter((item) =>
    sources.get(item.sourceMessageId)?.includes(item.originalText),
  );
  parsed.vocabularyUpgrades = parsed.vocabularyUpgrades.filter((item) =>
    sources.get(item.sourceMessageId)?.includes(item.originalText),
  );
  const d = parsed.dimensions;
  const overallScore = Math.round(
    d.grammar.score * 0.35 +
      d.vocabulary.score * 0.25 +
      d.interaction.score * 0.25 +
      d.taskAchievement.score * 0.15,
  );
  return { ...parsed, overallScore };
}
