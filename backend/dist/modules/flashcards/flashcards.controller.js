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
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const user_entity_1 = require("../../entities/user.entity");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const flashcard_dto_1 = require("./dto/flashcard.dto");
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
        const card = await this.flashcardsService.reviewCard(user.id, cardId, data.quality);
        return { status: 'success', card };
    }
};
exports.FlashcardsController = FlashcardsController;
__decorate([
    (0, common_1.Post)('mine'),
    (0, swagger_1.ApiOperation)({ summary: 'Mine a new vocabulary flashcard' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, flashcard_dto_1.MineFlashcardDto]),
    __metadata("design:returntype", Promise)
], FlashcardsController.prototype, "mine", null);
__decorate([
    (0, common_1.Get)('review'),
    (0, swagger_1.ApiOperation)({ summary: 'Get flashcards due for review' }),
    openapi.ApiResponse({ status: 200, type: [require("../../entities/flashcard.entity").Flashcard] }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], FlashcardsController.prototype, "getReview", null);
__decorate([
    (0, common_1.Post)('review/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Submit a flashcard review quality score' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, description: 'Flashcard id' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, Number, flashcard_dto_1.ReviewFlashcardDto]),
    __metadata("design:returntype", Promise)
], FlashcardsController.prototype, "review", null);
exports.FlashcardsController = FlashcardsController = __decorate([
    (0, swagger_1.ApiTags)('flashcards'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Controller)('api/flashcards'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [flashcards_service_1.FlashcardsService])
], FlashcardsController);
//# sourceMappingURL=flashcards.controller.js.map