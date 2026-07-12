"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlowSessionsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const flow_session_entity_1 = require("../../entities/flow-session.entity");
const user_entity_1 = require("../../entities/user.entity");
const story_entity_1 = require("../../entities/story.entity");
const flashcard_entity_1 = require("../../entities/flashcard.entity");
const flow_sessions_service_1 = require("./flow-sessions.service");
const flow_sessions_controller_1 = require("./flow-sessions.controller");
let FlowSessionsModule = class FlowSessionsModule {
};
exports.FlowSessionsModule = FlowSessionsModule;
exports.FlowSessionsModule = FlowSessionsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([flow_session_entity_1.FlowSession, user_entity_1.User, story_entity_1.Story, flashcard_entity_1.Flashcard])],
        providers: [flow_sessions_service_1.FlowSessionsService],
        controllers: [flow_sessions_controller_1.FlowSessionsController],
        exports: [flow_sessions_service_1.FlowSessionsService],
    })
], FlowSessionsModule);
//# sourceMappingURL=flow-sessions.module.js.map