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
exports.SimulatorsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const simulators_dto_1 = require("./dto/simulators.dto");
const simulators_service_1 = require("./simulators.service");
let SimulatorsController = class SimulatorsController {
    simulatorsService;
    constructor(simulatorsService) {
        this.simulatorsService = simulatorsService;
    }
    async evaluateShadowing(body) {
        return this.simulatorsService.evaluateShadowing(body.target_sentence, body.transcript);
    }
    async quickOutputReply(body) {
        return this.simulatorsService.evaluateQuickOutput(body.message, body.story_title);
    }
};
exports.SimulatorsController = SimulatorsController;
__decorate([
    (0, common_1.Post)('shadowing/evaluate'),
    (0, swagger_1.ApiOperation)({ summary: 'Evaluate a shadowing attempt' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [simulators_dto_1.EvaluateShadowingDto]),
    __metadata("design:returntype", Promise)
], SimulatorsController.prototype, "evaluateShadowing", null);
__decorate([
    (0, common_1.Post)('quick-output/reply'),
    (0, swagger_1.ApiOperation)({ summary: 'Evaluate a quick-output reply' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [simulators_dto_1.QuickOutputReplyDto]),
    __metadata("design:returntype", Promise)
], SimulatorsController.prototype, "quickOutputReply", null);
exports.SimulatorsController = SimulatorsController = __decorate([
    (0, swagger_1.ApiTags)('simulators'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Controller)('api'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [simulators_service_1.SimulatorsService])
], SimulatorsController);
//# sourceMappingURL=simulators.controller.js.map