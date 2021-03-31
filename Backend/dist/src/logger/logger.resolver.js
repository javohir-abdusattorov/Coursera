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
exports.LoggerResolver = void 0;
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
const logger_service_1 = require("./logger.service");
const logger_entity_1 = require("./model/logger.entity");
const logger_type_1 = require("./model/logger.type");
const auth_provider_1 = require("../auth/auth.provider");
const user_entity_1 = require("../user/model/user.entity");
let LoggerResolver = class LoggerResolver {
    constructor(service, authService) {
        this.service = service;
        this.authService = authService;
    }
    async getMyLogs(token) {
        const user = await this.authService.authorizeByToken(token);
        return this.service.getUserLogs(user.id);
    }
    async getUserLogs(id) {
        return this.service.getUserLogs(id);
    }
    user(logger) {
        return logger.user;
    }
};
__decorate([
    graphql_1.Query(() => logger_type_1.LoggerType),
    __param(0, graphql_1.Args("token")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LoggerResolver.prototype, "getMyLogs", null);
__decorate([
    graphql_1.Query(() => logger_type_1.LoggerType),
    __param(0, graphql_1.Args("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LoggerResolver.prototype, "getUserLogs", null);
__decorate([
    graphql_1.ResolveField(),
    __param(0, graphql_1.Parent()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [logger_entity_1.Logger]),
    __metadata("design:returntype", user_entity_1.User)
], LoggerResolver.prototype, "user", null);
LoggerResolver = __decorate([
    graphql_1.Resolver(of => logger_type_1.LoggerType),
    __param(1, common_1.Inject(common_1.forwardRef(() => auth_provider_1.AuthProvider))),
    __metadata("design:paramtypes", [logger_service_1.LoggerService,
        auth_provider_1.AuthProvider])
], LoggerResolver);
exports.LoggerResolver = LoggerResolver;
//# sourceMappingURL=logger.resolver.js.map