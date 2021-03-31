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
exports.CommentController = void 0;
const common_1 = require("@nestjs/common");
const comment_service_1 = require("./comment.service");
const create_comment_dto_1 = require("./dto/create-comment.dto");
const edit_comment_dto_1 = require("./dto/edit-comment.dto");
const request_user_decorator_1 = require("../auth/decorators/request-user.decorator");
const user_entity_1 = require("../user/model/user.entity");
const user_roles_enum_1 = require("../user/enum/user-roles.enum");
const auth_decorator_1 = require("../auth/decorators/auth.decorator");
let CommentController = class CommentController {
    constructor(service) {
        this.service = service;
    }
    postComment(id, user, body) {
        return this.service.postComment(user, id, body);
    }
    editComment(id, user, body) {
        return this.service.editComment(user, id, body);
    }
    deleteComment(id, user) {
        return this.service.deleteComment(user, id);
    }
    deleteCommentByAdmin(id) {
        return this.service.deleteCommentByAdmin(id);
    }
};
__decorate([
    common_1.Post("/create/:id"),
    auth_decorator_1.Auth(user_roles_enum_1.UserRoles.USER),
    common_1.UsePipes(common_1.ValidationPipe),
    __param(0, common_1.Param("id", common_1.ParseIntPipe)),
    __param(1, request_user_decorator_1.RequestUser()),
    __param(2, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, user_entity_1.User,
        create_comment_dto_1.CreateCommentDto]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "postComment", null);
__decorate([
    common_1.Patch("/edit/:id"),
    auth_decorator_1.Auth(user_roles_enum_1.UserRoles.USER),
    common_1.UsePipes(common_1.ValidationPipe),
    __param(0, common_1.Param("id", common_1.ParseIntPipe)),
    __param(1, request_user_decorator_1.RequestUser()),
    __param(2, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, user_entity_1.User,
        edit_comment_dto_1.EditCommentDto]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "editComment", null);
__decorate([
    common_1.Delete("/delete/:id"),
    auth_decorator_1.Auth(user_roles_enum_1.UserRoles.USER),
    __param(0, common_1.Param("id", common_1.ParseIntPipe)),
    __param(1, request_user_decorator_1.RequestUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "deleteComment", null);
__decorate([
    common_1.Delete("/admin-delete/:id"),
    auth_decorator_1.Auth(user_roles_enum_1.UserRoles.ADMIN),
    __param(0, common_1.Param("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "deleteCommentByAdmin", null);
CommentController = __decorate([
    common_1.Controller("api/comments"),
    __metadata("design:paramtypes", [comment_service_1.CommentService])
], CommentController);
exports.CommentController = CommentController;
//# sourceMappingURL=comment.controller.js.map