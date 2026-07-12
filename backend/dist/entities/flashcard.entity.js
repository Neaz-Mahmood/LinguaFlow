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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Flashcard = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
let Flashcard = class Flashcard {
    id;
    userId;
    word;
    translation;
    contextSentence;
    contextTranslation;
    easiness;
    interval;
    repetitions;
    nextReviewDate;
    user;
};
exports.Flashcard = Flashcard;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Flashcard.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", Number)
], Flashcard.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Flashcard.prototype, "word", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Flashcard.prototype, "translation", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Flashcard.prototype, "contextSentence", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Flashcard.prototype, "contextTranslation", void 0);
__decorate([
    (0, typeorm_1.Column)('float', { default: 2.5 }),
    __metadata("design:type", Number)
], Flashcard.prototype, "easiness", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Flashcard.prototype, "interval", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Flashcard.prototype, "repetitions", void 0);
__decorate([
    (0, typeorm_1.Column)('date', { default: () => 'CURRENT_DATE' }),
    __metadata("design:type", Date)
], Flashcard.prototype, "nextReviewDate", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.flashcards, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], Flashcard.prototype, "user", void 0);
exports.Flashcard = Flashcard = __decorate([
    (0, typeorm_1.Entity)('flashcards')
], Flashcard);
//# sourceMappingURL=flashcard.entity.js.map