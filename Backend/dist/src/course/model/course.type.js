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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseType = void 0;
const graphql_1 = require("@nestjs/graphql");
const user_type_1 = require("../../user/model/user.type");
const category_type_1 = require("../../category/model/category.type");
const comment_type_1 = require("../../comment/model/comment.type");
let CourseType = class CourseType {
};
__decorate([
    graphql_1.Field((type) => graphql_1.ID),
    __metadata("design:type", Number)
], CourseType.prototype, "id", void 0);
__decorate([
    graphql_1.Field(),
    __metadata("design:type", String)
], CourseType.prototype, "title", void 0);
__decorate([
    graphql_1.Field(),
    __metadata("design:type", String)
], CourseType.prototype, "description", void 0);
__decorate([
    graphql_1.Field(),
    __metadata("design:type", Number)
], CourseType.prototype, "price", void 0);
__decorate([
    graphql_1.Field(),
    __metadata("design:type", String)
], CourseType.prototype, "video", void 0);
__decorate([
    graphql_1.Field(),
    __metadata("design:type", String)
], CourseType.prototype, "poster", void 0);
__decorate([
    graphql_1.Field(),
    __metadata("design:type", Number)
], CourseType.prototype, "sold", void 0);
__decorate([
    graphql_1.Field(),
    __metadata("design:type", Number)
], CourseType.prototype, "rating", void 0);
__decorate([
    graphql_1.Field(),
    __metadata("design:type", Boolean)
], CourseType.prototype, "discount", void 0);
__decorate([
    graphql_1.Field(),
    __metadata("design:type", Number)
], CourseType.prototype, "discountPercent", void 0);
__decorate([
    graphql_1.Field(),
    __metadata("design:type", Number)
], CourseType.prototype, "discountDeadline", void 0);
__decorate([
    graphql_1.Field(),
    __metadata("design:type", Boolean)
], CourseType.prototype, "active", void 0);
__decorate([
    graphql_1.Field(),
    __metadata("design:type", Boolean)
], CourseType.prototype, "saved", void 0);
__decorate([
    graphql_1.Field(type => [String]),
    __metadata("design:type", Array)
], CourseType.prototype, "tags", void 0);
__decorate([
    graphql_1.Field(),
    __metadata("design:type", Date)
], CourseType.prototype, "createdAt", void 0);
__decorate([
    graphql_1.Field(),
    __metadata("design:type", Date)
], CourseType.prototype, "updatedAt", void 0);
__decorate([
    graphql_1.Field(type => user_type_1.UserType),
    __metadata("design:type", user_type_1.UserType)
], CourseType.prototype, "author", void 0);
__decorate([
    graphql_1.Field(type => category_type_1.CategoryType),
    __metadata("design:type", category_type_1.CategoryType)
], CourseType.prototype, "category", void 0);
__decorate([
    graphql_1.Field(type => [comment_type_1.CommentType]),
    __metadata("design:type", Array)
], CourseType.prototype, "comments", void 0);
__decorate([
    graphql_1.Field(type => [user_type_1.UserType]),
    __metadata("design:type", Array)
], CourseType.prototype, "customers", void 0);
CourseType = __decorate([
    graphql_1.ObjectType("Course")
], CourseType);
exports.CourseType = CourseType;
//# sourceMappingURL=course.type.js.map