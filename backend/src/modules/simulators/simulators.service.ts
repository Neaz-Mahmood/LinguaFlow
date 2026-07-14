import { Injectable } from '@nestjs/common';

@Injectable()
export class SimulatorsService {
  
  evaluateShadowing(targetSentence: string, transcript?: string): any {
    const targetWords = targetSentence.trim().split(/\s+/);
    
    // Normalize word helper
    const normalize = (text: string) => {
      let t = text.toLowerCase();
      t = t.replace(/[¡!¿?,\.\'\";\(\)]/g, '');
      // Replace accents
      const accents = { 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ü': 'u', 'ñ': 'n' };
      for (const [acc, reg] of Object.entries(accents)) {
        t = t.replace(new RegExp(acc, 'g'), reg);
      }
      return t.trim().split(/\s+/);
    };

    const normalizedTarget = normalize(targetSentence);
    
    let userTranscript = transcript;
    if (!userTranscript) {
      // Simulate speech attempt
      if (Math.random() > 0.3) {
        userTranscript = targetSentence;
      } else {
        const words = targetSentence.split(/\s+/);
        if (words.length > 2) {
          words[Math.floor(Math.random() * words.length)] = '...';
        }
        userTranscript = words.join(' ');
      }
    }

    const normalizedUser = normalize(userTranscript);
    
    const feedback: any[] = [];
    let correctCount = 0;

    for (let i = 0; i < targetWords.length; i++) {
      const tWord = targetWords[i];
      const normT = normalizedTarget[i] || '';
      
      let isCorrect = false;
      const userWordIdx = normalizedUser.indexOf(normT);
      if (userWordIdx !== -1) {
        isCorrect = true;
        correctCount++;
        normalizedUser.splice(userWordIdx, 1); // remove to handle duplicates
      }

      feedback.push({
        word: tWord,
        status: isCorrect ? 'correct' : 'mispronounced',
      });
    }

    const score = targetWords.length > 0 ? Math.round((correctCount / targetWords.length) * 100) : 100;

    return {
      score,
      feedback,
      transcript: userTranscript,
    };
  }

  evaluateQuickOutput(userMessage: string, storyTitle: string): any {
    const msg = userMessage.toLowerCase().trim();
    const corrections: string[] = [];

    // Lightweight Spanish heuristics (legacy Quick Output); other languages get general praise.
    if (msg.includes('yo gusta') || msg.includes('me gustar') || msg.includes('yo gustar')) {
      corrections.push('Use "me gusta" instead of "yo gusta" or "yo gustar" when expressing likes.');
    }
    if (msg.includes('es en la') || msg.includes('es en el')) {
      corrections.push('Use "está" (from *estar*) instead of "es" (from *ser*) for locations. For example: "está en la cafetería".');
    }

    const storyHints = [
      'café',
      'cafe',
      'croissant',
      'cruasán',
      'compra',
      'paga',
      'kaffee',
      'croissant',
      'カフェ',
      '買',
    ];
    const mentionsStory = storyHints.some((hint) => msg.includes(hint));

    let reply = 'Great attempt! ';
    if (mentionsStory && storyTitle) {
      reply += `You referenced details related to "${storyTitle}". `;
    } else {
      reply += 'Nice expression — keep expanding your vocabulary. ';
    }
    reply += 'Practice a little every day to build fluency (Speak From Day One).';

    let correctionText =
      '✨ **Grammar:** Your response looks clean. Keep going!';
    if (corrections.length > 0) {
      correctionText =
        '💡 **Grammar Tip:**\n' + corrections.map((c) => `- ${c}`).join('\n');
    }

    return {
      reply,
      correction: correctionText,
    };
  }
}
