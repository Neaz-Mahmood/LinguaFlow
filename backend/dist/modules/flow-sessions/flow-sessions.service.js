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
exports.FlowSessionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const flow_session_entity_1 = require("../../entities/flow-session.entity");
const user_entity_1 = require("../../entities/user.entity");
const story_entity_1 = require("../../entities/story.entity");
const flashcard_entity_1 = require("../../entities/flashcard.entity");
let FlowSessionsService = class FlowSessionsService {
    sessionsRepository;
    usersRepository;
    storiesRepository;
    flashcardsRepository;
    constructor(sessionsRepository, usersRepository, storiesRepository, flashcardsRepository) {
        this.sessionsRepository = sessionsRepository;
        this.usersRepository = usersRepository;
        this.storiesRepository = storiesRepository;
        this.flashcardsRepository = flashcardsRepository;
    }
    async getTodaySession(userId) {
        const today = new Date().toISOString().split('T')[0];
        let session = await this.sessionsRepository.findOne({
            where: { userId, date: today },
        });
        if (!session) {
            session = this.sessionsRepository.create({
                userId,
                date: today,
                comprehensibleInputCompleted: false,
                srsCompleted: false,
                shadowingCompleted: false,
                outputCompleted: false,
                stepsCompleted: 0,
            });
            await this.sessionsRepository.save(session);
        }
        return session;
    }
    async getTodayFullSession(userId) {
        const session = await this.getTodaySession(userId);
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        const level = user ? user.currentLevel : 'A1';
        const stories = await this.storiesRepository.find({ where: { level } });
        const story = stories[0]
            ? {
                id: stories[0].id,
                title: stories[0].title,
                level: stories[0].level,
                content_target: stories[0].contentTarget,
                content_english: stories[0].contentEnglish,
                words: stories[0].wordsJson ? JSON.parse(stories[0].wordsJson) : {},
                sentences: stories[0].sentencesJson
                    ? JSON.parse(stories[0].sentencesJson)
                    : [],
            }
            : null;
        const todayStr = new Date().toISOString().split('T')[0];
        const dueCards = await this.flashcardsRepository.find({
            where: {
                userId,
                nextReviewDate: (0, typeorm_2.LessThanOrEqual)(todayStr),
            },
        });
        const shadowPhrase = story && story.sentences && story.sentences[0]
            ? story.sentences[0]
            : {
                target: 'Sofía va a la cafetería todas las mañanas.',
                english: 'Sofía goes to the coffee shop every morning.',
            };
        const outputPrompt = story
            ? `¿Qué compró el personaje principal en la historia "${story.title}"?`
            : '¿Qué hiciste hoy? Responde en español.';
        return {
            story,
            dueCards,
            shadowPhrase,
            outputPrompt,
            streakCount: user ? user.streakCount : 0,
            stepsCompleted: session.stepsCompleted,
            session,
        };
    }
    async updateSession(userId, data) {
        const session = await this.getTodaySession(userId);
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (data.comprehensible_input_completed !== undefined &&
            data.comprehensible_input_completed !== session.comprehensibleInputCompleted) {
            session.comprehensibleInputCompleted = data.comprehensible_input_completed;
            if (session.comprehensibleInputCompleted && session.stepsCompleted < 1) {
                session.stepsCompleted = 1;
            }
        }
        if (data.srs_completed !== undefined &&
            data.srs_completed !== session.srsCompleted) {
            session.srsCompleted = data.srs_completed;
            if (session.srsCompleted && session.stepsCompleted < 2) {
                session.stepsCompleted = 2;
            }
        }
        if (data.shadowing_completed !== undefined &&
            data.shadowing_completed !== session.shadowingCompleted) {
            session.shadowingCompleted = data.shadowing_completed;
            if (session.shadowingCompleted && session.stepsCompleted < 3) {
                session.stepsCompleted = 3;
            }
        }
        if (data.output_completed !== undefined &&
            data.output_completed !== session.outputCompleted) {
            session.outputCompleted = data.output_completed;
            if (session.outputCompleted && session.stepsCompleted < 4) {
                session.stepsCompleted = 4;
                if (user) {
                    const todayStr = new Date().toISOString().split('T')[0];
                    if (user.lastActiveDate !== todayStr) {
                        const yesterday = new Date();
                        yesterday.setDate(yesterday.getDate() - 1);
                        const yesterdayStr = yesterday.toISOString().split('T')[0];
                        if (user.lastActiveDate === yesterdayStr) {
                            user.streakCount += 1;
                        }
                        else {
                            user.streakCount = 1;
                        }
                        user.lastActiveDate = todayStr;
                        await this.usersRepository.save(user);
                    }
                }
            }
        }
        if (data.shadowing_score !== undefined) {
            session.shadowingScore = Number(data.shadowing_score);
        }
        if (data.quick_output_response !== undefined) {
            session.quickOutputResponse = data.quick_output_response;
        }
        if (data.quick_output_feedback !== undefined) {
            session.quickOutputFeedback = data.quick_output_feedback;
        }
        return this.sessionsRepository.save(session);
    }
};
exports.FlowSessionsService = FlowSessionsService;
exports.FlowSessionsService = FlowSessionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(flow_session_entity_1.FlowSession)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(story_entity_1.Story)),
    __param(3, (0, typeorm_1.InjectRepository)(flashcard_entity_1.Flashcard)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], FlowSessionsService);
//# sourceMappingURL=flow-sessions.service.js.map