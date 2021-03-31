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
exports.CategoryType = void 0;
const graphql_1 = require("@nestjs/graphql");
const course_type_1 = require("../../course/model/course.type");
let CategoryType = class CategoryType {
};
__decorate([
    graphql_1.Field((type) => graphql_1.ID),
    __metadata("design:type", Number)
], CategoryType.prototype, "id", void 0);
__decorate([
    graphql_1.Field(),
    __metadata("design:type", String)
], CategoryType.prototype, "name", void 0);
__decorate([
    graphql_1.Field(),
    __metadata("design:type", Date)
], CategoryType.prototype, "createdAt", void 0);
__decorate([
    graphql_1.Field(),
    __metadata("design:type", Date)
], CategoryType.prototype, "updatedAt", void 0);
__decorate([
    graphql_1.Field(type => [course_type_1.CourseType]),
    __metadata("design:type", Array)
], CategoryType.prototype, "courses", void 0);
CategoryType = __decorate([
    graphql_1.ObjectType("Category")
], CategoryType);
exports.CategoryType = CategoryType;
//# sourceMappingURL=category.type.js.map