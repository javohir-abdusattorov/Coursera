"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const logger_service_1 = require("./logger.service");
const logger_resolver_1 = require("./logger.resolver");
const logger_repository_1 = require("./model/logger.repository");
const auth_module_1 = require("../auth/auth.module");
let LoggerModule = class LoggerModule {
};
LoggerModule = __decorate([
    common_1.Module({
        imports: [
            common_1.forwardRef(() => auth_module_1.AuthModule),
            typeorm_1.TypeOrmModule.forFeature([logger_repository_1.LoggerRepository]),
        ],
        controllers: [],
        providers: [logger_service_1.LoggerService, logger_resolver_1.LoggerResolver],
        exports: [logger_service_1.LoggerService]
    })
], LoggerModule);
exports.LoggerModule = LoggerModule;
//# sourceMappingURL=logger.module.js.map