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
exports.CategoryController = void 0;
const common_1 = require("@nestjs/common");
const category_service_1 = require("./category.service");
const create_category_dto_1 = require("./dto/create-category.dto");
const edit_category_dto_1 = require("./dto/edit-category.dto");
const auth_decorator_1 = require("../auth/decorators/auth.decorator");
const user_roles_enum_1 = require("../user/enum/user-roles.enum");
let CategoryController = class CategoryController {
    constructor(service) {
        this.service = service;
    }
    createCategory(body) {
        return this.service.createCategory(body);
    }
    editCategory(id, body) {
        return this.service.editCategory(id, body);
    }
};
__decorate([
    common_1.Post("/create"),
    auth_decorator_1.Auth(user_roles_enum_1.UserRoles.ADMIN),
    common_1.UsePipes(common_1.ValidationPipe),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_category_dto_1.CreateCategoryDto]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "createCategory", null);
__decorate([
    common_1.Patch("/edit/:id"),
    auth_decorator_1.Auth(user_roles_enum_1.UserRoles.ADMIN),
    common_1.UsePipes(common_1.ValidationPipe),
    __param(0, common_1.Param("id", common_1.ParseIntPipe)),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, edit_category_dto_1.EditCategoryDto]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "editCategory", null);
CategoryController = __decorate([
    common_1.Controller('api/category'),
    __metadata("design:paramtypes", [category_service_1.CategoryService])
], CategoryController);
exports.CategoryController = CategoryController;
//# sourceMappingURL=category.controller.js.map