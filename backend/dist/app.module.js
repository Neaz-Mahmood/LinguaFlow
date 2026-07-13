"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./entities/user.entity");
const story_entity_1 = require("./entities/story.entity");
const flashcard_entity_1 = require("./entities/flashcard.entity");
const flow_session_entity_1 = require("./entities/flow-session.entity");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const stories_module_1 = require("./modules/stories/stories.module");
const flashcards_module_1 = require("./modules/flashcards/flashcards.module");
const flow_sessions_module_1 = require("./modules/flow-sessions/flow-sessions.module");
const simulators_module_1 = require("./modules/simulators/simulators.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    type: 'postgres',
                    host: config.get('DB_HOST', '127.0.0.1'),
                    port: config.get('DB_PORT', 5432),
                    username: config.get('DB_USERNAME', 'postgres'),
                    password: config.get('DB_PASSWORD', 'postgrespassword'),
                    database: config.get('DB_DATABASE', 'linguaflow'),
                    entities: [user_entity_1.User, story_entity_1.Story, flashcard_entity_1.Flashcard, flow_session_entity_1.FlowSession],
                    synchronize: true,
                }),
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            stories_module_1.StoriesModule,
            flashcards_module_1.FlashcardsModule,
            flow_sessions_module_1.FlowSessionsModule,
            simulators_module_1.SimulatorsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map