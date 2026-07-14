/** Target languages supported by AI conversation and seeded content. */
export const SUPPORTED_TARGET_LANGUAGES = [
  'Spanish',
  'French',
  'German',
  'Japanese',
] as const;

export type SupportedTargetLanguage =
  (typeof SUPPORTED_TARGET_LANGUAGES)[number];

export function normalizeTargetLanguage(
  value: string | null | undefined,
): SupportedTargetLanguage {
  const match = SUPPORTED_TARGET_LANGUAGES.find(
    (language) => language.toLowerCase() === (value || '').toLowerCase(),
  );
  return match ?? 'Spanish';
}

export function isSupportedTargetLanguage(value: string): boolean {
  return SUPPORTED_TARGET_LANGUAGES.some(
    (language) => language.toLowerCase() === value.toLowerCase(),
  );
}

const DEFAULT_SCENARIOS: Record<
  SupportedTargetLanguage,
  { title: string; context: string }
> = {
  Spanish: {
    title: 'Una conversación cotidiana',
    context: 'Hablen de lo que ocurrió hoy.',
  },
  French: {
    title: 'Une conversation quotidienne',
    context: "Parlez de ce qui s'est passé aujourd'hui.",
  },
  German: {
    title: 'Ein Alltagsgespräch',
    context: 'Sprechen Sie über das, was heute passiert ist.',
  },
  Japanese: {
    title: '日常会話',
    context: '今日あったことについて話しましょう。',
  },
};

export function defaultScenario(language: string) {
  return DEFAULT_SCENARIOS[normalizeTargetLanguage(language)];
}

const DEFAULT_OUTPUT_PROMPTS: Record<SupportedTargetLanguage, string> = {
  Spanish: '¿Qué hiciste hoy? Responde en español.',
  French: "Qu'as-tu fait aujourd'hui ? Réponds en français.",
  German: 'Was hast du heute gemacht? Antworte auf Deutsch.',
  Japanese: '今日は何をしましたか？日本語で答えてください。',
};

export function defaultOutputPrompt(language: string, storyTitle?: string) {
  const lang = normalizeTargetLanguage(language);
  if (storyTitle) {
    const templates: Record<SupportedTargetLanguage, string> = {
      Spanish: `¿Qué compró el personaje principal en la historia "${storyTitle}"?`,
      French: `Qu'a acheté le personnage principal dans l'histoire « ${storyTitle} » ?`,
      German: `Was hat die Hauptfigur in der Geschichte „${storyTitle}“ gekauft?`,
      Japanese: `物語「${storyTitle}」で主人公は何を買いましたか？`,
    };
    return templates[lang];
  }
  return DEFAULT_OUTPUT_PROMPTS[lang];
}

const DEFAULT_SHADOW: Record<
  SupportedTargetLanguage,
  { target: string; english: string }
> = {
  Spanish: {
    target: 'Sofía va a la cafetería todas las mañanas.',
    english: 'Sofía goes to the coffee shop every morning.',
  },
  French: {
    target: 'Sophie va au café tous les matins.',
    english: 'Sophie goes to the café every morning.',
  },
  German: {
    target: 'Sofia geht jeden Morgen ins Café.',
    english: 'Sofia goes to the café every morning.',
  },
  Japanese: {
    target: 'ソフィアは毎朝カフェに行きます。',
    english: 'Sophia goes to the café every morning.',
  },
};

export function defaultShadowPhrase(language: string) {
  return DEFAULT_SHADOW[normalizeTargetLanguage(language)];
}
