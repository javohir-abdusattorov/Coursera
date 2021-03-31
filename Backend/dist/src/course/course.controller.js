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
exports.CourseController = void 0;
const common_1 = require("@nestjs/common");
const course_service_1 = require("./course.service");
const create_course_dto_1 = require("./dto/create-course.dto");
const edit_course_dto_1 = require("./dto/edit-course.dto");
const request_user_decorator_1 = require("../auth/decorators/request-user.decorator");
const user_entity_1 = require("../user/model/user.entity");
const user_roles_enum_1 = require("../user/enum/user-roles.enum");
const auth_decorator_1 = require("../auth/decorators/auth.decorator");
const parse_request_middleware_1 = require("../services/middlewares/parse-request.middleware");
const parser_decorator_1 = require("../services/decorators/parser.decorator");
let CourseController = class CourseController {
    constructor(service) {
        this.service = service;
    }
    createCourse(req, user, body) {
        return this.service.createCourse(user, body, req.files);
    }
    editCourse(req, user, id, body) {
        return this.service.editCourse(user, id, body, req.files);
    }
    deleteCourse(user, id) {
        return this.service.deleteCourse(id, user);
    }
    addCourseToSaved(user, id) {
        return this.service.addCourseToSaved(user, id);
    }
    removeCourseFromSaved(user, id) {
        return this.service.removeCourseFromSaved(user, id);
    }
    canBuyCourse(id, user) {
        return this.service.canBuyCourse(user, id);
    }
    canReturnCourse(id, user) {
        return this.service.canReturnCourse(user, id);
    }
    buyCourse(id, user) {
        return this.service.buyCourse(id, user);
    }
    returnCourse(id, user) {
        return this.service.returnCourse(id, user);
    }
    rateCourse(id, user, rating) {
        return this.service.rateCourse(id, user, rating);
    }
    activateCourse(id) {
        return this.service.activateCourse(id);
    }
    disableCourse(id) {
        return this.service.disableCourse(id);
    }
    toggleSaved(id) {
        return this.service.toggleSaved(id);
    }
    clearDB() {
        return this.service.clearDB();
    }
};
__decorate([
    common_1.Post("/create"),
    auth_decorator_1.Auth(user_roles_enum_1.UserRoles.USER),
    parser_decorator_1.Parser(["price::number", "tags::json", "category::number"]),
    common_1.UsePipes(common_1.ValidationPipe),
    __param(0, common_1.Request()),
    __param(1, request_user_decorator_1.RequestUser()),
    __param(2, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_entity_1.User,
        create_course_dto_1.CreateCourseDto]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "createCourse", null);
__decorate([
    common_1.Patch("/edit/:id"),
    auth_decorator_1.Auth(user_roles_enum_1.UserRoles.USER),
    parser_decorator_1.Parser([
        "price::number",
        "tags::json",
        "category::number",
        "discount::json",
        "discountPercent::number",
        "discountDeadline::date"
    ]),
    common_1.UsePipes(common_1.ValidationPipe),
    __param(0, common_1.Request()),
    __param(1, request_user_decorator_1.RequestUser()),
    __param(2, common_1.Param("id", common_1.ParseIntPipe)),
    __param(3, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_entity_1.User, Number, edit_course_dto_1.EditCourseDto]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "editCourse", null);
__decorate([
    common_1.Delete("/delete/:id"),
    auth_decorator_1.Auth(user_roles_enum_1.UserRoles.USER),
    common_1.UsePipes(common_1.ValidationPipe),
    __param(0, request_user_decorator_1.RequestUser()),
    __param(1, common_1.Param("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, Number]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "deleteCourse", null);
__decorate([
    common_1.Post("/add-saved/:id"),
    auth_decorator_1.Auth(user_roles_enum_1.UserRoles.USER),
    __param(0, request_user_decorator_1.RequestUser()),
    __param(1, common_1.Param("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, Number]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "addCourseToSaved", null);
__decorate([
    common_1.Post("/remove-saved/:id"),
    auth_decorator_1.Auth(user_roles_enum_1.UserRoles.USER),
    __param(0, request_user_decorator_1.RequestUser()),
    __param(1, common_1.Param("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, Number]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "removeCourseFromSaved", null);
__decorate([
    common_1.Post("/can-buy/:id"),
    auth_decorator_1.Auth(user_roles_enum_1.UserRoles.USER),
    __param(0, common_1.Param("id", common_1.ParseIntPipe)),
    __param(1, request_user_decorator_1.RequestUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "canBuyCourse", null);
__decorate([
    common_1.Post("/can-return/:id"),
    auth_decorator_1.Auth(user_roles_enum_1.UserRoles.USER),
    __param(0, common_1.Param("id", common_1.ParseIntPipe)),
    __param(1, request_user_decorator_1.RequestUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "canReturnCourse", null);
__decorate([
    common_1.Post("/buy/:id"),
    auth_decorator_1.Auth(user_roles_enum_1.UserRoles.USER),
    __param(0, common_1.Param("id", common_1.ParseIntPipe)),
    __param(1, request_user_decorator_1.RequestUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "buyCourse", null);
__decorate([
    common_1.Delete("/return/:id"),
    auth_decorator_1.Auth(user_roles_enum_1.UserRoles.USER),
    __param(0, common_1.Param("id", common_1.ParseIntPipe)),
    __param(1, request_user_decorator_1.RequestUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "returnCourse", null);
__decorate([
    common_1.Patch("/rate/:id"),
    auth_decorator_1.Auth(user_roles_enum_1.UserRoles.USER),
    __param(0, common_1.Param("id", common_1.ParseIntPipe)),
    __param(1, request_user_decorator_1.RequestUser()),
    __param(2, common_1.Body("rating", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, user_entity_1.User, Number]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "rateCourse", null);
__decorate([
    common_1.Post("/activate-course/:id"),
    auth_decorator_1.Auth(user_roles_enum_1.UserRoles.ADMIN),
    __param(0, common_1.Param("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "activateCourse", null);
__decorate([
    common_1.Post("/disable-course/:id"),
    auth_decorator_1.Auth(user_roles_enum_1.UserRoles.ADMIN),
    __param(0, common_1.Param("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "disableCourse", null);
__decorate([
    common_1.Patch("/toggle-saved/:id"),
    auth_decorator_1.Auth(user_roles_enum_1.UserRoles.ADMIN),
    __param(0, common_1.Param("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "toggleSaved", null);
__decorate([
    common_1.Get("/delete/all"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "clearDB", null);
CourseController = __decorate([
    common_1.Controller('api/courses'),
    common_1.UseGuards(parse_request_middleware_1.ParserGuard),
    __metadata("design:paramtypes", [course_service_1.CourseService])
], CourseController);
exports.CourseController = CourseController;
//# sourceMappingURL=course.controller.js.map