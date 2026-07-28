import { ConversationSession } from '../../entities/conversation-session.entity';
import { ConversationMessage } from '../../entities/conversation-message.entity';

export abstract class VoiceAiProvider {
  abstract transcribe(
    audio: Buffer,
    mimeType: string,
    language: string,
  ): Promise<{ text: string; userSpeakingSec: number }>;

  abstract converse(
    session: ConversationSession,
    transcript: ConversationMessage[],
    opts: { short: boolean },
  ): Promise<{ text: string; inputTokens: number; outputTokens: number }>;

  abstract synthesize(
    text: string,
    language: string,
  ): Promise<{ audio: Buffer; audioSec: number }>;
}
