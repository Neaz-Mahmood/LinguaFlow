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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../../entities/user.entity");
const flow_session_entity_1 = require("../../entities/flow-session.entity");
let UsersService = class UsersService {
    usersRepository;
    sessionsRepository;
    constructor(usersRepository, sessionsRepository) {
        this.usersRepository = usersRepository;
        this.sessionsRepository = sessionsRepository;
    }
    async getDefaultUser() {
        let user = await this.usersRepository.findOne({ where: { id: 1 } });
        if (!user) {
            user = this.usersRepository.create({
                id: 1,
                targetLanguage: 'Spanish',
                currentLevel: 'A1',
                dailyCommitment: 15,
                strategyPreference: 'input',
            });
            await this.usersRepository.save(user);
        }
        return user;
    }
    async onboardUser(data) {
        let user = await this.getDefaultUser();
        user.targetLanguage = data.target_language || 'Spanish';
        user.currentLevel = data.current_level || 'A1';
        user.dailyCommitment = Number(data.daily_commitment) || 15;
        user.strategyPreference = data.strategy_preference || 'input';
        await this.usersRepository.save(user);
        const today = new Date().toISOString().split('T')[0];
        const session = await this.sessionsRepository.findOne({
            where: { userId: user.id, date: today },
        });
        if (session) {
            await this.sessionsRepository.remove(session);
        }
        const newSession = this.sessionsRepository.create({
            userId: user.id,
            date: today,
            comprehensibleInputCompleted: false,
            srsCompleted: false,
            shadowingCompleted: false,
            outputCompleted: false,
        });
        await this.sessionsRepository.save(newSession);
        return user;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(flow_session_entity_1.FlowSession)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map