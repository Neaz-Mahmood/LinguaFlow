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
exports.FlashcardsController = void 0;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("../../entities/user.entity");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const flashcards_service_1 = require("./flashcards.service");
let FlashcardsController = class FlashcardsController {
    flashcardsService;
    constructor(flashcardsService) {
        this.flashcardsService = flashcardsService;
    }
    async mine(user, data) {
        const card = await this.flashcardsService.mineCard(user.id, data);
        return { status: 'created', card };
    }
    async getReview(user) {
        return this.flashcardsService.getReviewCards(user.id);
    }
    async review(user, cardId, data) {
        const quality = Number(data.quality) ?? 3;
        const card = await this.flashcardsService.reviewCard(user.id, cardId, quality);
        return { status: 'success', card };
    }
};
exports.FlashcardsController = FlashcardsController;
__decorate([
    (0, common_1.Post)('mine'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, Object]),
    __metadata("design:returntype", Promise)
], FlashcardsController.prototype, "mine", null);
__decorate([
    (0, common_1.Get)('review'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], FlashcardsController.prototype, "getReview", null);
__decorate([
    (0, common_1.Post)('review/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, Number, Object]),
    __metadata("design:returntype", Promise)
], FlashcardsController.prototype, "review", null);
exports.FlashcardsController = FlashcardsController = __decorate([
    (0, common_1.Controller)('api/flashcards'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [flashcards_service_1.FlashcardsService])
], FlashcardsController);
//# sourceMappingURL=flashcards.controller.js.map