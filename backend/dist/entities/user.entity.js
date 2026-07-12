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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const flashcard_entity_1 = require("./flashcard.entity");
const flow_session_entity_1 = require("./flow-session.entity");
let User = class User {
    id;
    targetLanguage;
    currentLevel;
    dailyCommitment;
    strategyPreference;
    createdAt;
    flashcards;
    sessions;
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'Spanish' }),
    __metadata("design:type", String)
], User.prototype, "targetLanguage", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'A1' }),
    __metadata("design:type", String)
], User.prototype, "currentLevel", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 15 }),
    __metadata("design:type", Number)
], User.prototype, "dailyCommitment", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'input' }),
    __metadata("design:type", String)
], User.prototype, "strategyPreference", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => flashcard_entity_1.Flashcard, (flashcard) => flashcard.user),
    __metadata("design:type", Array)
], User.prototype, "flashcards", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => flow_session_entity_1.FlowSession, (session) => session.user),
    __metadata("design:type", Array)
], User.prototype, "sessions", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('users')
], User);
//# sourceMappingURL=user.entity.js.map