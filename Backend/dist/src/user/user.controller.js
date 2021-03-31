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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const user_service_1 = require("./user.service");
const user_entity_1 = require("./model/user.entity");
const request_user_decorator_1 = require("../auth/decorators/request-user.decorator");
const auth_decorator_1 = require("../auth/decorators/auth.decorator");
const edit_user_dto_1 = require("./dto/edit-user.dto");
const user_roles_enum_1 = require("./enum/user-roles.enum");
let UserController = class UserController {
    constructor(service) {
        this.service = service;
    }
    subscribe(user, id) {
        return this.service.subscribe(user, id);
    }
    unsubscribe(user, id) {
        return this.service.unsubscribe(user, id);
    }
    editUser(req, user, body) {
        return this.service.editUser(user, body, req.files);
    }
    toggleSaved(id) {
        return this.service.toggleSpam(id);
    }
    createAdmin() {
        return this.service.createAdmin();
    }
};
__decorate([
    common_1.Post("/subscribe/:id"),
    auth_decorator_1.Auth(user_roles_enum_1.UserRoles.USER),
    __param(0, request_user_decorator_1.RequestUser()),
    __param(1, common_1.Param("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "subscribe", null);
__decorate([
    common_1.Post("/unsubscribe/:id"),
    auth_decorator_1.Auth(user_roles_enum_1.UserRoles.USER),
    __param(0, request_user_decorator_1.RequestUser()),
    __param(1, common_1.Param("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "unsubscribe", null);
__decorate([
    common_1.Patch("/edit"),
    common_1.UseGuards(passport_1.AuthGuard()),
    common_1.UsePipes(common_1.ValidationPipe),
    __param(0, common_1.Request()),
    __param(1, request_user_decorator_1.RequestUser()),
    __param(2, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_entity_1.User,
        edit_user_dto_1.EditUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "editUser", null);
__decorate([
    common_1.Patch("/toggle-spam/:id"),
    auth_decorator_1.Auth(user_roles_enum_1.UserRoles.ADMIN),
    common_1.UsePipes(common_1.ValidationPipe),
    __param(0, common_1.Param("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "toggleSaved", null);
__decorate([
    common_1.Get("/create-admin"),
    common_1.UsePipes(common_1.ValidationPipe),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createAdmin", null);
UserController = __decorate([
    common_1.Controller('api/users'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map