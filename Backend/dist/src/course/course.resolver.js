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
exports.CourseResolver = void 0;
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
const course_service_1 = require("./course.service");
const course_entity_1 = require("./model/course.entity");
const course_type_1 = require("./model/course.type");
const auth_provider_1 = require("../auth/auth.provider");
let CourseResolver = class CourseResolver {
    constructor(service, authService) {
        this.service = service;
        this.authService = authService;
    }
    getAllCourses() {
        return this.service.getAllCourses();
    }
    getCourse(id) {
        return this.service.getCourse(id);
    }
    searchCourse(q) {
        return this.service.searchCourse(q);
    }
    async getMyCourses(token) {
        const user = await this.authService.authorizeByToken(token);
        return this.service.getMyCourses(user);
    }
    getAuthorCourses(author) {
        return this.service.getAuthorCourses(author);
    }
    getCategoryCourses(category) {
        return this.service.getCategoryCourses(category);
    }
    getDiscountCourses() {
        return this.service.getDiscountCourses();
    }
    getSavedCourses() {
        return this.service.getSavedCourses();
    }
    getCoursesByTags(tags) {
        return this.service.getCoursesByTags(tags);
    }
    async getFavouriteCourses(token) {
        const user = await this.authService.authorizeByToken(token);
        return this.service.getFavouriteCourses(user);
    }
    async author(course) {
        return this.service._getCourseAuthor(course);
    }
    async category(course) {
        return this.service._getCourseCategory(course);
    }
    async comments(course) {
        return this.service._getCourseComments(course);
    }
    async customers(course) {
        return this.service._getCourseCustomers(course);
    }
};
__decorate([
    graphql_1.Query(() => [course_type_1.CourseType]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CourseResolver.prototype, "getAllCourses", null);
__decorate([
    graphql_1.Query(() => course_type_1.CourseType),
    __param(0, graphql_1.Args("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CourseResolver.prototype, "getCourse", null);
__decorate([
    graphql_1.Query(() => [course_type_1.CourseType]),
    __param(0, graphql_1.Args("q")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CourseResolver.prototype, "searchCourse", null);
__decorate([
    graphql_1.Query(() => [course_type_1.CourseType]),
    __param(0, graphql_1.Args("token")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CourseResolver.prototype, "getMyCourses", null);
__decorate([
    graphql_1.Query(() => [course_type_1.CourseType]),
    __param(0, graphql_1.Args("author")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CourseResolver.prototype, "getAuthorCourses", null);
__decorate([
    graphql_1.Query(() => [course_type_1.CourseType]),
    __param(0, graphql_1.Args("category")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CourseResolver.prototype, "getCategoryCourses", null);
__decorate([
    graphql_1.Query(() => [course_type_1.CourseType]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CourseResolver.prototype, "getDiscountCourses", null);
__decorate([
    graphql_1.Query(() => [course_type_1.CourseType]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CourseResolver.prototype, "getSavedCourses", null);
__decorate([
    graphql_1.Query(() => [course_type_1.CourseType]),
    __param(0, graphql_1.Args({ name: "tags", type: () => [String] })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], CourseResolver.prototype, "getCoursesByTags", null);
__decorate([
    graphql_1.Query(() => [course_type_1.CourseType]),
    __param(0, graphql_1.Args("token")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CourseResolver.prototype, "getFavouriteCourses", null);
__decorate([
    graphql_1.ResolveField(),
    __param(0, graphql_1.Parent()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [course_entity_1.Course]),
    __metadata("design:returntype", Promise)
], CourseResolver.prototype, "author", null);
__decorate([
    graphql_1.ResolveField(),
    __param(0, graphql_1.Parent()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [course_entity_1.Course]),
    __metadata("design:returntype", Promise)
], CourseResolver.prototype, "category", null);
__decorate([
    graphql_1.ResolveField(),
    __param(0, graphql_1.Parent()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [course_entity_1.Course]),
    __metadata("design:returntype", Promise)
], CourseResolver.prototype, "comments", null);
__decorate([
    graphql_1.ResolveField(),
    __param(0, graphql_1.Parent()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [course_entity_1.Course]),
    __metadata("design:returntype", Promise)
], CourseResolver.prototype, "customers", null);
CourseResolver = __decorate([
    graphql_1.Resolver(() => course_type_1.CourseType),
    __param(1, common_1.Inject(common_1.forwardRef(() => auth_provider_1.AuthProvider))),
    __metadata("design:paramtypes", [course_service_1.CourseService,
        auth_provider_1.AuthProvider])
], CourseResolver);
exports.CourseResolver = CourseResolver;
//# sourceMappingURL=course.resolver.js.map