"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlashcardsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const flashcard_entity_1 = require("../../entities/flashcard.entity");
let FlashcardsService = class FlashcardsService {
    flashcardRepository;
    constructor(flashcardRepository) {
        this.flashcardRepository = flashcardRepository;
    }
    updateSM2(easiness, interval, repetitions, quality) {
        let newInterval = 0;
        let newRepetitions = 0;
        let newEasiness = easiness;
        if (quality < 0 || quality > 5) {
            quality = 3;
        }
        if (quality >= 3) {
            if (repetitions === 0) {
                newInterval = 1;
            }
            else if (repetitions === 1) {
                newInterval = 6;
            }
            else {
                newInterval = Math.round(interval * easiness);
            }
            newRepetitions = repetitions + 1;
        }
        else {
            newRepetitions = 0;
            newInterval = 1;
        }
        newEasiness = easiness + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
        if (newEasiness < 1.3) {
            newEasiness = 1.3;
        }
        return {
            easiness: newEasiness,
            interval: newInterval,
            repetitions: newRepetitions,
        };
    }
    async mineCard(data) {
        const cleanWord = data.word.trim();
        let existing = await this.flashcardRepository.findOne({
            where: { userId: 1, word: cleanWord },
        });
        if (existing) {
            return existing;
        }
        const todayStr = new Date().toISOString().split('T')[0];
        const card = this.flashcardRepository.create({
            userId: 1,
            word: cleanWord,
            translation: data.translation,
            contextSentence: data.context_sentence || '',
            contextTranslation: data.context_translation || '',
            easiness: 2.5,
            interval: 0,
            repetitions: 0,
            nextReviewDate: todayStr,
        });
        return this.flashcardRepository.save(card);
    }
    async getReviewCards() {
        const todayStr = new Date().toISOString().split('T')[0];
        return this.flashcardRepository.find({
            where: {
                userId: 1,
                nextReviewDate: (0, typeorm_2.LessThanOrEqual)(todayStr),
            },
        });
    }
    async reviewCard(cardId, quality) {
        const card = await this.flashcardRepository.findOne({
            where: { id: cardId, userId: 1 },
        });
        if (!card) {
            throw new common_1.NotFoundException('Flashcard not found');
        }
        const { easiness, interval, repetitions } = this.updateSM2(card.easiness, card.interval, card.repetitions, quality);
        card.easiness = easiness;
        card.interval = interval;
        card.repetitions = repetitions;
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + interval);
        card.nextReviewDate = nextDate.toISOString().split('T')[0];
        return this.flashcardRepository.save(card);
    }
};
exports.FlashcardsService = FlashcardsService;
exports.FlashcardsService = FlashcardsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(flashcard_entity_1.Flashcard)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], FlashcardsService);
//# sourceMappingURL=flashcards.service.js.map