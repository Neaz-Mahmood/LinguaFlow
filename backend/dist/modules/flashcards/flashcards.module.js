"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlashcardsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const flashcard_entity_1 = require("../../entities/flashcard.entity");
const flashcards_service_1 = require("./flashcards.service");
const flashcards_controller_1 = require("./flashcards.controller");
let FlashcardsModule = class FlashcardsModule {
};
exports.FlashcardsModule = FlashcardsModule;
exports.FlashcardsModule = FlashcardsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([flashcard_entity_1.Flashcard])],
        providers: [flashcards_service_1.FlashcardsService],
        controllers: [flashcards_controller_1.FlashcardsController],
        exports: [flashcards_service_1.FlashcardsService],
    })
], FlashcardsModule);
//# sourceMappingURL=flashcards.module.js.map