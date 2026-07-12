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
let FlowSessionsService = class FlowSessionsService {
    sessionsRepository;
    constructor(sessionsRepository) {
        this.sessionsRepository = sessionsRepository;
    }
    async getTodaySession() {
        const today = new Date().toISOString().split('T')[0];
        let session = await this.sessionsRepository.findOne({
            where: { userId: 1, date: today },
        });
        if (!session) {
            session = this.sessionsRepository.create({
                userId: 1,
                date: today,
                comprehensibleInputCompleted: false,
                srsCompleted: false,
                shadowingCompleted: false,
                outputCompleted: false,
            });
            await this.sessionsRepository.save(session);
        }
        return session;
    }
    async updateSession(data) {
        const session = await this.getTodaySession();
        if (!session) {
            throw new common_1.NotFoundException('Flow session not found');
        }
        if (data.comprehensible_input_completed !== undefined) {
            session.comprehensibleInputCompleted = data.comprehensible_input_completed;
        }
        if (data.srs_completed !== undefined) {
            session.srsCompleted = data.srs_completed;
        }
        if (data.shadowing_completed !== undefined) {
            session.shadowingCompleted = data.shadowing_completed;
        }
        if (data.output_completed !== undefined) {
            session.outputCompleted = data.output_completed;
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
    __metadata("design:paramtypes", [typeorm_2.Repository])
], FlowSessionsService);
//# sourceMappingURL=flow-sessions.service.js.map