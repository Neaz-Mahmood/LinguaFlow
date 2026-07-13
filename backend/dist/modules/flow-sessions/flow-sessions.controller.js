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
exports.FlowSessionsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const user_entity_1 = require("../../entities/user.entity");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const update_flow_session_dto_1 = require("./dto/update-flow-session.dto");
const flow_sessions_service_1 = require("./flow-sessions.service");
let FlowSessionsController = class FlowSessionsController {
    sessionsService;
    constructor(sessionsService) {
        this.sessionsService = sessionsService;
    }
    async get(user) {
        return this.sessionsService.getTodaySession(user.id);
    }
    async getTodayFull(user) {
        return this.sessionsService.getTodayFullSession(user.id);
    }
    async update(user, data) {
        return this.sessionsService.updateSession(user.id, data);
    }
};
exports.FlowSessionsController = FlowSessionsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "Get today's flow session entity" }),
    openapi.ApiResponse({ status: 200, type: require("../../entities/flow-session.entity").FlowSession }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], FlowSessionsController.prototype, "get", null);
__decorate([
    (0, common_1.Get)('today'),
    (0, swagger_1.ApiOperation)({
        summary: "Get today's full daily flow payload (story, cards, prompts)",
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], FlowSessionsController.prototype, "getTodayFull", null);
__decorate([
    (0, common_1.Post)('update'),
    (0, swagger_1.ApiOperation)({ summary: 'Update step completion flags for today’s session' }),
    openapi.ApiResponse({ status: 201, type: require("../../entities/flow-session.entity").FlowSession }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, update_flow_session_dto_1.UpdateFlowSessionDto]),
    __metadata("design:returntype", Promise)
], FlowSessionsController.prototype, "update", null);
exports.FlowSessionsController = FlowSessionsController = __decorate([
    (0, swagger_1.ApiTags)('flow-session'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Controller)('api/flow-session'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [flow_sessions_service_1.FlowSessionsService])
], FlowSessionsController);
//# sourceMappingURL=flow-sessions.controller.js.map