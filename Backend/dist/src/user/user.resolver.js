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
exports.UserResolver = void 0;
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
const user_entity_1 = require("./model/user.entity");
const user_service_1 = require("./user.service");
const user_type_1 = require("./model/user.type");
const user_roles_enum_1 = require("./enum/user-roles.enum");
const auth_provider_1 = require("../auth/auth.provider");
let UserResolver = class UserResolver {
    constructor(service, authService) {
        this.service = service;
        this.authService = authService;
    }
    async getAllUsers() {
        return this.service.getAllUsers();
    }
    async getUser(id) {
        return this.service.getUserById(id);
    }
    async getAdmin() {
        return this.service.getAdmin();
    }
    async getMe(token) {
        const user = await this.authService.authorizeByToken(token);
        return user;
    }
    async getSubscribedUsers(token) {
        const user = await this.authService.authorizeByToken(token);
        return this.service.getSubscribedUsers(user);
    }
    async searchUser(q) {
        return this.service.searchUser(q);
    }
    async courses(user) {
        if (user.role == user_roles_enum_1.UserRoles.ADMIN)
            return [];
        return this.service._getUserCourses(user);
    }
    async purchasedCourses(user) {
        if (user.role == user_roles_enum_1.UserRoles.ADMIN)
            return [];
        return this.service._getUserPurchasedCourses(user);
    }
    async comments(user) {
        if (user.role == user_roles_enum_1.UserRoles.ADMIN)
            return [];
        return this.service._getUserComments(user);
    }
    async savedCourses(user) {
        if (user.role == user_roles_enum_1.UserRoles.ADMIN)
            return [];
        return this.service._getUserSavedCourses(user);
    }
    async subscriptions(user) {
        if (user.role == user_roles_enum_1.UserRoles.ADMIN)
            return [];
        return this.service._getUserSubscriptions(user);
    }
    async logs(user) {
        if (user.role == user_roles_enum_1.UserRoles.ADMIN)
            return [];
        return this.service._getUserLogs(user);
    }
};
__decorate([
    graphql_1.Query(returns => [user_type_1.UserType]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getAllUsers", null);
__decorate([
    graphql_1.Query(returns => user_type_1.UserType),
    __param(0, graphql_1.Args("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getUser", null);
__decorate([
    graphql_1.Query(returns => user_type_1.UserType),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getAdmin", null);
__decorate([
    graphql_1.Query(returns => user_type_1.UserType),
    __param(0, graphql_1.Args("token")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getMe", null);
__decorate([
    graphql_1.Query(returns => [user_type_1.UserType]),
    __param(0, graphql_1.Args("token")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getSubscribedUsers", null);
__decorate([
    graphql_1.Query(returns => [user_type_1.UserType]),
    __param(0, graphql_1.Args("q")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "searchUser", null);
__decorate([
    graphql_1.ResolveField(),
    __param(0, graphql_1.Parent()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "courses", null);
__decorate([
    graphql_1.ResolveField(),
    __param(0, graphql_1.Parent()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "purchasedCourses", null);
__decorate([
    graphql_1.ResolveField(),
    __param(0, graphql_1.Parent()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "comments", null);
__decorate([
    graphql_1.ResolveField(),
    __param(0, graphql_1.Parent()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "savedCourses", null);
__decorate([
    graphql_1.ResolveField(),
    __param(0, graphql_1.Parent()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "subscriptions", null);
__decorate([
    graphql_1.ResolveField(),
    __param(0, graphql_1.Parent()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "logs", null);
UserResolver = __decorate([
    graphql_1.Resolver(of => user_type_1.UserType),
    __param(1, common_1.Inject(common_1.forwardRef(() => auth_provider_1.AuthProvider))),
    __metadata("design:paramtypes", [user_service_1.UserService,
        auth_provider_1.AuthProvider])
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=user.resolver.js.map