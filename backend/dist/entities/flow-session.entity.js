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
exports.FlowSession = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
let FlowSession = class FlowSession {
    id;
    userId;
    date;
    stepsCompleted;
    comprehensibleInputCompleted;
    srsCompleted;
    shadowingCompleted;
    outputCompleted;
    shadowingScore;
    quickOutputResponse;
    quickOutputFeedback;
    user;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, userId: { required: true, type: () => Number }, date: { required: true, type: () => Date }, stepsCompleted: { required: true, type: () => Number }, comprehensibleInputCompleted: { required: true, type: () => Boolean }, srsCompleted: { required: true, type: () => Boolean }, shadowingCompleted: { required: true, type: () => Boolean }, outputCompleted: { required: true, type: () => Boolean }, shadowingScore: { required: true, type: () => Number }, quickOutputResponse: { required: true, type: () => String }, quickOutputFeedback: { required: true, type: () => String }, user: { required: true, type: () => require("./user.entity").User } };
    }
};
exports.FlowSession = FlowSession;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], FlowSession.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", Number)
], FlowSession.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)('date', { default: () => 'CURRENT_DATE' }),
    __metadata("design:type", Date)
], FlowSession.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], FlowSession.prototype, "stepsCompleted", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], FlowSession.prototype, "comprehensibleInputCompleted", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], FlowSession.prototype, "srsCompleted", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], FlowSession.prototype, "shadowingCompleted", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], FlowSession.prototype, "outputCompleted", void 0);
__decorate([
    (0, typeorm_1.Column)('float', { default: 0.0 }),
    __metadata("design:type", Number)
], FlowSession.prototype, "shadowingScore", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], FlowSession.prototype, "quickOutputResponse", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], FlowSession.prototype, "quickOutputFeedback", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.sessions, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], FlowSession.prototype, "user", void 0);
exports.FlowSession = FlowSession = __decorate([
    (0, typeorm_1.Entity)('flow_sessions')
], FlowSession);
//# sourceMappingURL=flow-session.entity.js.map