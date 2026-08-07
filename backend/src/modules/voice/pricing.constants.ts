/**
 * Estimated cost per unit in micros (millionths of £1).
 * Replace with measured production data after launch.
 */
export const VOICE_PRICING = {
  // STT: per audio second of input
  'gpt-4o-mini-transcribe': { perAudioSecIn: 5 },   // ~£0.003/min
  'gpt-4o-transcribe':      { perAudioSecIn: 10 },  // ~£0.006/min

  // LLM: per token
  'gpt-4o-mini': { perInputToken: 0.15, perOutputToken: 0.6 },
  'gpt-5.4-nano': { perInputToken: 0.1, perOutputToken: 0.4 },

  // TTS: per audio second of output
  'gpt-4o-mini-tts': { perAudioSecOut: 200 },       // ~£12/1M audio tokens ≈ £0.012/min
} as const;

export function estimateCostMicros(
  model: string,
  opts: {
    audioSecondsIn?: number;
    inputTokens?: number;
    outputTokens?: number;
    audioSecondsOut?: number;
  },
): bigint {
  const p = VOICE_PRICING[model as keyof typeof VOICE_PRICING];
  if (!p) return 0n;
  let cost = 0n;
  if ('perAudioSecIn' in p && opts.audioSecondsIn)
    cost += BigInt(Math.round(p.perAudioSecIn * opts.audioSecondsIn));
  if ('perInputToken' in p && opts.inputTokens)
    cost += BigInt(Math.round(p.perInputToken * opts.inputTokens));
  if ('perInputToken' in p && opts.outputTokens)
    cost += BigInt(Math.round((p as { perOutputToken: number }).perOutputToken * opts.outputTokens));
  if ('perAudioSecOut' in p && opts.audioSecondsOut)
    cost += BigInt(Math.round(p.perAudioSecOut * opts.audioSecondsOut));
  return cost;
}
