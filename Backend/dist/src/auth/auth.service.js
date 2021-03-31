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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
const auth_provider_1 = require("./auth.provider");
const user_repository_1 = require("../user/model/user.repository");
const logger_service_1 = require("../logger/logger.service");
let AuthService = class AuthService {
    constructor(User, jwtService, provider, loggerService) {
        this.User = User;
        this.jwtService = jwtService;
        this.provider = provider;
        this.loggerService = loggerService;
        this.logger = new common_1.Logger("App:Auth");
    }
    async register(body) {
        this.logger.log(`Guest [${body.username}] trying to register`);
        const password = await this.provider.hashPassword(body.password);
        const user = await this.User.createUser(body.username, password);
        const token = await this.provider.generateToken(user.id);
        this.logger.verbose(`User registred. ID [${user.id}]`);
        await this.loggerService.initilizeLogger(user);
        return { user, token };
    }
    async login(body) {
        const { username, password } = body;
        this.logger.log(`Guest [${username}] trying to login`);
        const user = await this.User.findUser(username);
        const isCorrectPassword = await this.provider.checkPassword(password, user.password);
        if (!isCorrectPassword) {
            this.logger.warn(`Guest [${username}] failed to login: incorrect password`);
            throw new common_1.BadRequestException(`Invalid password`);
        }
        const token = await this.provider.generateToken(user.id);
        this.logger.verbose(`Guest [${username}] logged in. ID [${user.id}]`);
        return {
            role: user.role,
            user,
            token
        };
    }
};
AuthService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(user_repository_1.UserRepository)),
    __param(3, common_1.Inject(common_1.forwardRef(() => logger_service_1.LoggerService))),
    __metadata("design:paramtypes", [user_repository_1.UserRepository,
        jwt_1.JwtService,
        auth_provider_1.AuthProvider,
        logger_service_1.LoggerService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map