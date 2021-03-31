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
var UserType_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserType = void 0;
const graphql_1 = require("@nestjs/graphql");
const user_roles_enum_1 = require("../enum/user-roles.enum");
const course_type_1 = require("../../course/model/course.type");
const comment_type_1 = require("../../comment/model/comment.type");
const log_type_1 = require("../../logger/model/log.type");
let UserType = UserType_1 = class UserType {
};
__decorate([
    graphql_1.Field((type) => graphql_1.ID),
    __metadata("design:type", Number)
], UserType.prototype, "id", void 0);
__decorate([
    graphql_1.Field(),
    __metadata("design:type", String)
], UserType.prototype, "username", void 0);
__decorate([
    graphql_1.Field(),
    __metadata("design:type", Number)
], UserType.prototype, "account", void 0);
__decorate([
    graphql_1.Field(),
    __metadata("design:type", String)
], UserType.prototype, "profilePicture", void 0);
__decorate([
    graphql_1.Field(),
    __metadata("design:type", Boolean)
], UserType.prototype, "spam", void 0);
__decorate([
    graphql_1.Field(),
    __metadata("design:type", Number)
], UserType.prototype, "subscribersCount", void 0);
__decorate([
    graphql_1.Field(),
    __metadata("design:type", Date)
], UserType.prototype, "createdAt", void 0);
__decorate([
    graphql_1.Field(),
    __metadata("design:type", Date)
], UserType.prototype, "updatedAt", void 0);
__decorate([
    graphql_1.Field(type => String),
    __metadata("design:type", String)
], UserType.prototype, "role", void 0);
__decorate([
    graphql_1.Field(type => [course_type_1.CourseType]),
    __metadata("design:type", Array)
], UserType.prototype, "courses", void 0);
__decorate([
    graphql_1.Field(type => [comment_type_1.CommentType]),
    __metadata("design:type", Array)
], UserType.prototype, "comments", void 0);
__decorate([
    graphql_1.Field(type => [course_type_1.CourseType]),
    __metadata("design:type", Array)
], UserType.prototype, "purchasedCourses", void 0);
__decorate([
    graphql_1.Field(type => [course_type_1.CourseType]),
    __metadata("design:type", Array)
], UserType.prototype, "savedCourses", void 0);
__decorate([
    graphql_1.Field(type => [UserType_1]),
    __metadata("design:type", Array)
], UserType.prototype, "subscriptions", void 0);
__decorate([
    graphql_1.Field(type => [log_type_1.LogType]),
    __metadata("design:type", Array)
], UserType.prototype, "logs", void 0);
UserType = UserType_1 = __decorate([
    graphql_1.ObjectType("User")
], UserType);
exports.UserType = UserType;
//# sourceMappingURL=user.type.js.map