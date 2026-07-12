"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimulatorsService = void 0;
const common_1 = require("@nestjs/common");
let SimulatorsService = class SimulatorsService {
    evaluateShadowing(targetSentence, transcript) {
        const targetWords = targetSentence.trim().split(/\s+/);
        const normalize = (text) => {
            let t = text.toLowerCase();
            t = t.replace(/[¡!¿?,\.\'\";\(\)]/g, '');
            const accents = { 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ü': 'u', 'ñ': 'n' };
            for (const [acc, reg] of Object.entries(accents)) {
                t = t.replace(new RegExp(acc, 'g'), reg);
            }
            return t.trim().split(/\s+/);
        };
        const normalizedTarget = normalize(targetSentence);
        let userTranscript = transcript;
        if (!userTranscript) {
            if (Math.random() > 0.3) {
                userTranscript = targetSentence;
            }
            else {
                const words = targetSentence.split(/\s+/);
                if (words.length > 2) {
                    words[Math.floor(Math.random() * words.length)] = '...';
                }
                userTranscript = words.join(' ');
            }
        }
        const normalizedUser = normalize(userTranscript);
        const feedback = [];
        let correctCount = 0;
        for (let i = 0; i < targetWords.length; i++) {
            const tWord = targetWords[i];
            const normT = normalizedTarget[i] || '';
            let isCorrect = false;
            const userWordIdx = normalizedUser.indexOf(normT);
            if (userWordIdx !== -1) {
                isCorrect = true;
                correctCount++;
                normalizedUser.splice(userWordIdx, 1);
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
    evaluateQuickOutput(userMessage, storyTitle) {
        const msg = userMessage.toLowerCase().trim();
        const corrections = [];
        if (msg.includes('yo gusta') || msg.includes('me gustar') || msg.includes('yo gustar')) {
            corrections.push('Use "me gusta" instead of "yo gusta" or "yo gustar" when expressing likes.');
        }
        if (msg.includes('es en la') || msg.includes('es en el')) {
            corrections.push('Use "está" (from *estar*) instead of "es" (from *ser*) for locations. For example: "está en la cafetería".');
        }
        let reply = '¡Excelente intento! ';
        if (msg.includes('café') || msg.includes('cafe') || msg.includes('croissant') || msg.includes('cruasán') || msg.includes('compra') || msg.includes('paga')) {
            reply += `Has respondido correctamente sobre los detalles de la historia "${storyTitle}". `;
        }
        else {
            reply += '¡Muy bien expresado! Has usado vocabulario variado en tu respuesta. ';
        }
        reply += 'Sigue practicando todos los días para consolidar tu fluidez (Speak From Day One).';
        let correctionText = '✨ **Grammar:** Your response looks clean and grammatical. ¡Buen trabajo!';
        if (corrections.length > 0) {
            correctionText = '💡 **Grammar Tip:**\n' + corrections.map((c) => `- ${c}`).join('\n');
        }
        return {
            reply,
            correction: correctionText,
        };
    }
};
exports.SimulatorsService = SimulatorsService;
exports.SimulatorsService = SimulatorsService = __decorate([
    (0, common_1.Injectable)()
], SimulatorsService);
//# sourceMappingURL=simulators.service.js.map