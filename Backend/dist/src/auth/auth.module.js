"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const auth_provider_1 = require("./auth.provider");
const jwt_strategy_1 = require("./jwt/jwt.strategy");
const jwt_config_1 = require("./jwt/jwt.config");
const user_repository_1 = require("../user/model/user.repository");
const logger_module_1 = require("../logger/logger.module");
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    common_1.Module({
        imports: [
            logger_module_1.LoggerModule,
            passport_1.PassportModule.register({ defaultStrategy: "jwt" }),
            jwt_1.JwtModule.register(jwt_config_1.JwtOptions),
            typeorm_1.TypeOrmModule.forFeature([user_repository_1.UserRepository]),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [
            auth_service_1.AuthService,
            auth_provider_1.AuthProvider,
            jwt_strategy_1.JwtStrategy,
        ],
        exports: [
            auth_provider_1.AuthProvider,
            jwt_strategy_1.JwtStrategy,
            passport_1.PassportModule,
        ]
    })
], AuthModule);
exports.AuthModule = AuthModule;
//# sourceMappingURL=auth.module.js.map