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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_provider_1 = require("./user.provider");
const user_repository_1 = require("./model/user.repository");
const user_roles_enum_1 = require("./enum/user-roles.enum");
const auth_provider_1 = require("../auth/auth.provider");
const logger_service_1 = require("../logger/logger.service");
const log_type_enum_1 = require("../logger/enum/log-type.enum");
let UserService = class UserService {
    constructor(provider, User, authService, loggerService) {
        this.provider = provider;
        this.User = User;
        this.authService = authService;
        this.loggerService = loggerService;
        this.logger = new common_1.Logger(`App:Users`);
    }
    async getAllUsers() {
        this.logger.log(`Graphql client sending query [getAllUsers]`);
        return this.User.find({ role: user_roles_enum_1.UserRoles.USER });
    }
    async getUserById(id) {
        this.logger.log(`Graphql client sending query [getUserById]. ID [${id}]`);
        return this.User.findById(id);
    }
    async getAdmin() {
        this.logger.log(`Graphql client sending query [getAdmin]`);
        return this.User.findAdmin();
    }
    async getSubscribedUsers(user) {
        this.logger.log(`Graphql client sending query [getSubscribedUsers]. User [${user.id}]`);
        const { subscriptions } = await this.User.findById(user.id, ["subscriptions"]);
        return subscriptions;
    }
    async searchUser(q) {
        this.logger.log(`Graphql client sending query [searchUser]. Search by [${q}]`);
        return this.User.searchUser(q);
    }
    async _getUserCourses(user) {
        const { courses } = await this.User.findById(user.id, ["courses"]);
        return courses;
    }
    async _getUserPurchasedCourses(user) {
        const { purchasedCourses } = await this.User.findById(user.id, ["purchasedCourses"]);
        return purchasedCourses;
    }
    async _getUserComments(user) {
        const { comments } = await this.User.findById(user.id, ["comments"]);
        return comments;
    }
    async _getUserSavedCourses(user) {
        const { savedCourses } = await this.User.findById(user.id, ["savedCourses"]);
        return savedCourses;
    }
    async _getUserSubscriptions(user) {
        const { subscriptions } = await this.User.findById(user.id, ["subscriptions"]);
        return subscriptions;
    }
    async _getUserLogs(user) {
        const { logs } = await this.loggerService.getUserLogs(user.id);
        return logs;
    }
    async subscribe(user, id) {
        this.logger.log(`User [${user.username}] trying to subscribe to channel [${id}]`);
        const channel = await this.User.findById(id);
        user = await this.User.findById(user.id, ["subscriptions"]);
        const validationResult = this.provider.canUserSubscribe(user, channel);
        if (validationResult !== true) {
            this.logger.warn(`User [${user.username}] failed to subscribe: ${validationResult}`);
            throw new common_1.BadRequestException(validationResult);
        }
        channel.subscribersCount++;
        user.subscriptions.push(channel);
        await channel.save();
        await user.save();
        this.logger.verbose(`User [${user.username}] subscribed to channel [${channel.username}]`);
        this.loggerService.log(channel.id, log_type_enum_1.LogTypes.INFO, `User (${user.username}) subscribed to your channel. Your subscribers <${channel.subscribersCount}>`);
    }
    async unsubscribe(user, id) {
        this.logger.log(`User [${user.username}] trying to unsubscribe from channel [${id}]`);
        const channel = await this.User.findById(id);
        user = await this.User.findById(user.id, ["subscriptions"]);
        const j = user.subscriptions.findIndex(item => item.id === channel.id);
        if (j < 0) {
            this.logger.warn(`User [${user.username}] failed to unsubscribe: user not subscribed yet`);
            throw new common_1.BadRequestException(`You are not subscribed to channel`);
        }
        channel.subscribersCount--;
        user.subscriptions.splice(j, 1);
        await channel.save();
        await user.save();
        this.logger.verbose(`User [${user.username}] unsubscribed from channel [${id}]`);
        this.loggerService.log(channel.id, log_type_enum_1.LogTypes.WARN, `User (${user.username}) unsubscribed from your channel. Your subscribers <${channel.subscribersCount}>`);
    }
    async editUser(user, body, files) {
        this.logger.verbose(`User [${user.username}] trying to edit`);
        const fields = ["username"];
        const [error, query] = await this.provider.createEditUserQuery(fields, user, body, files);
        if (error) {
            this.logger.warn(`User [${user.username}] failed to edit: ${error}`);
            throw new common_1.BadRequestException(error);
        }
        if (!Object.entries(query).length) {
            this.logger.warn(`User [${user.username}] failed to edit: no data`);
            throw new common_1.BadRequestException("No data!");
        }
        const updatedUser = await this.User.updateUser(user, query);
        this.logger.verbose(`User [${user.username}] edited`);
        return updatedUser;
    }
    async toggleSpam(id) {
        const user = await this.User.findById(id);
        this.logger.log(`[Admin] trying to ${user.spam ? "spam" : "remove from spam"} user [${user.username}]`);
        const updateUser = await this.User.updateUser(user, { spam: !user.spam });
        this.logger.verbose(`[Admin] ${user.spam ? "spamed" : "removed from spam"} user [${user.username}]`);
        if (user.spam) {
            this.loggerService.log(user.id, log_type_enum_1.LogTypes.DANGER, `You are spammed`);
        }
        else {
            this.loggerService.log(user.id, log_type_enum_1.LogTypes.SUCCESS, `You are removed from spam`);
        }
        return updateUser;
    }
    async createAdmin() {
        const password = await this.authService.hashPassword(`qwerty3003`);
        const user = await this.User.createAdmin(password);
        const accessToken = await this.authService.generateToken(user.id);
        return { user, accessToken };
    }
};
UserService = __decorate([
    common_1.Injectable(),
    __param(1, typeorm_1.InjectRepository(user_repository_1.UserRepository)),
    __param(2, common_1.Inject(common_1.forwardRef(() => auth_provider_1.AuthProvider))),
    __param(3, common_1.Inject(common_1.forwardRef(() => logger_service_1.LoggerService))),
    __metadata("design:paramtypes", [user_provider_1.UserProvider,
        user_repository_1.UserRepository,
        auth_provider_1.AuthProvider,
        logger_service_1.LoggerService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map