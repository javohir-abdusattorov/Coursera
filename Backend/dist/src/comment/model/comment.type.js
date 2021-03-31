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
exports.CommentType = void 0;
const graphql_1 = require("@nestjs/graphql");
const course_type_1 = require("../../course/model/course.type");
const user_type_1 = require("../../user/model/user.type");
let CommentType = class CommentType {
};
__decorate([
    graphql_1.Field((type) => graphql_1.ID),
    __metadata("design:type", Number)
], CommentType.prototype, "id", void 0);
__decorate([
    graphql_1.Field(),
    __metadata("design:type", String)
], CommentType.prototype, "message", void 0);
__decorate([
    graphql_1.Field(),
    __metadata("design:type", Date)
], CommentType.prototype, "createdAt", void 0);
__decorate([
    graphql_1.Field(),
    __metadata("design:type", Date)
], CommentType.prototype, "updatedAt", void 0);
__decorate([
    graphql_1.Field(type => user_type_1.UserType),
    __metadata("design:type", user_type_1.UserType)
], CommentType.prototype, "user", void 0);
__decorate([
    graphql_1.Field(type => course_type_1.CourseType),
    __metadata("design:type", course_type_1.CourseType)
], CommentType.prototype, "course", void 0);
CommentType = __decorate([
    graphql_1.ObjectType("Comment")
], CommentType);
exports.CommentType = CommentType;
//# sourceMappingURL=comment.type.js.map