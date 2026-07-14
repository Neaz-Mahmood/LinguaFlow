export type ConversationStatus =
  | 'active'
  | 'assessment_queued'
  | 'assessing'
  | 'completed'
  | 'assessment_failed';

export type ConversationMessage = {
  id: string;
  sessionId: string;
  orderIndex: number;
  role: 'learner' | 'assistant';
  content: string;
  clientMessageId: string | null;
  generationStatus: 'persisted' | 'generating' | 'failed';
  createdAt: string;
  updatedAt: string;
};

export type FeedbackEvidence = {
  messageId: string;
  excerpt: string;
};

export type FeedbackDimension = {
  score: number;
  evidence: FeedbackEvidence[];
};

export type ConversationCorrection = {
  id: string;
  sourceMessageId: string;
  originalText: string;
  correctedSpanish: string;
  translation: string;
  explanation: string;
  severity: 'low' | 'medium' | 'high';
};

export type VocabularyUpgrade = {
  sourceMessageId: string;
  originalText: string;
  replacement: string;
  exampleSentence: string;
  translation: string;
  explanation: string;
};

export type ConversationFeedback = {
  summary: string;
  strengths: Array<{
    title: string;
    explanation: string;
    evidence: FeedbackEvidence;
  }>;
  estimatedCefr: string;
  confidence: number;
  dimensions: {
    grammar: FeedbackDimension;
    vocabulary: FeedbackDimension;
    interaction: FeedbackDimension;
    taskAchievement: FeedbackDimension;
  };
  corrections: ConversationCorrection[];
  vocabularyUpgrades: VocabularyUpgrade[];
  nextFocus: string;
  overallScore: number;
};

export type ConversationSession = {
  id: string;
  userId: number;
  flowSessionId: number;
  targetLanguage: string;
  nativeLanguage: string;
  cefrLevel: string;
  scenario: {
    storyId: number | null;
    title: string;
    context: string;
  };
  status: ConversationStatus;
  feedbackVersion: string | null;
  feedback: ConversationFeedback | null;
  failureCode: string | null;
  failureMessage: string | null;
  messages: ConversationMessage[];
  learnerTurnCount: number;
  maxLearnerTurns: number;
};

export type ConversationMessagePair = {
  userMessage: ConversationMessage;
  assistantMessage: ConversationMessage;
};
