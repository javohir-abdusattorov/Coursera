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
exports.LoggerService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const logger_repository_1 = require("./model/logger.repository");
const log_type_enum_1 = require("./enum/log-type.enum");
let LoggerService = class LoggerService {
    constructor(Logger) {
        this.Logger = Logger;
    }
    async getUserLogs(id) {
        return this.Logger.findOne({ user: { id } });
    }
    async initilizeLogger(user) {
        const newLogger = this.Logger.createLogger(user);
        newLogger.logs.push({
            type: log_type_enum_1.LogTypes.SUCCESS,
            createdAt: new Date().getTime(),
            message: `You registred successfuly. Your Username: <${user.username}>, ID: <${user.id}>. Welcome to (Online Courses)`
        });
        await newLogger.save();
    }
    async log(id, type, message) {
        const logger = await this.Logger.findOne({ user: { id } });
        logger.logs.push({
            type, message,
            createdAt: new Date().getTime()
        });
        await logger.save();
    }
};
LoggerService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(logger_repository_1.LoggerRepository)),
    __metadata("design:paramtypes", [logger_repository_1.LoggerRepository])
], LoggerService);
exports.LoggerService = LoggerService;
//# sourceMappingURL=logger.service.js.map