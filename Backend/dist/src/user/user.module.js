"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_controller_1 = require("./user.controller");
const user_service_1 = require("./user.service");
const user_provider_1 = require("./user.provider");
const user_resolver_1 = require("./user.resolver");
const user_repository_1 = require("./model/user.repository");
const auth_module_1 = require("../auth/auth.module");
const logger_module_1 = require("../logger/logger.module");
const services_module_1 = require("../services/services.module");
let UserModule = class UserModule {
};
UserModule = __decorate([
    common_1.Module({
        imports: [
            auth_module_1.AuthModule,
            logger_module_1.LoggerModule,
            services_module_1.ServicesModule,
            typeorm_1.TypeOrmModule.forFeature([user_repository_1.UserRepository]),
        ],
        controllers: [user_controller_1.UserController],
        providers: [user_resolver_1.UserResolver, user_service_1.UserService, user_provider_1.UserProvider],
        exports: [user_provider_1.UserProvider],
    })
], UserModule);
exports.UserModule = UserModule;
//# sourceMappingURL=user.module.js.map