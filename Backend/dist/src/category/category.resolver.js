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
exports.CategoryResolver = void 0;
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
const category_service_1 = require("./category.service");
const category_entity_1 = require("./model/category.entity");
const category_type_1 = require("./model/category.type");
const auth_provider_1 = require("../auth/auth.provider");
let CategoryResolver = class CategoryResolver {
    constructor(service, authService) {
        this.service = service;
        this.authService = authService;
    }
    getAllCategories() {
        return this.service.getAllCategories();
    }
    getCategory(id) {
        return this.service.getCategory(id);
    }
    searchCategory(q) {
        return this.service.searchCategory(q);
    }
    async courses(category) {
        return this.service._getCategoryCourses(category);
    }
};
__decorate([
    graphql_1.Query(returns => [category_type_1.CategoryType]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CategoryResolver.prototype, "getAllCategories", null);
__decorate([
    graphql_1.Query(returns => category_type_1.CategoryType),
    __param(0, graphql_1.Args("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CategoryResolver.prototype, "getCategory", null);
__decorate([
    graphql_1.Query(() => [category_type_1.CategoryType]),
    __param(0, graphql_1.Args("q")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CategoryResolver.prototype, "searchCategory", null);
__decorate([
    graphql_1.ResolveField(),
    __param(0, graphql_1.Parent()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [category_entity_1.Category]),
    __metadata("design:returntype", Promise)
], CategoryResolver.prototype, "courses", null);
CategoryResolver = __decorate([
    graphql_1.Resolver(of => category_type_1.CategoryType),
    __param(1, common_1.Inject(common_1.forwardRef(() => auth_provider_1.AuthProvider))),
    __metadata("design:paramtypes", [category_service_1.CategoryService,
        auth_provider_1.AuthProvider])
], CategoryResolver);
exports.CategoryResolver = CategoryResolver;
//# sourceMappingURL=category.resolver.js.map