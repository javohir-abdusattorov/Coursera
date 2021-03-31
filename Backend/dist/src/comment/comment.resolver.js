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
exports.CommentResolver = void 0;
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
const comment_service_1 = require("./comment.service");
const comment_entity_1 = require("./model/comment.entity");
const comment_type_1 = require("./model/comment.type");
const auth_provider_1 = require("../auth/auth.provider");
let CommentResolver = class CommentResolver {
    constructor(service, authService) {
        this.service = service;
        this.authService = authService;
    }
    getAllComments() {
        return this.getAllComments();
    }
    getComment(id) {
        return this.getComment(id);
    }
    async user(comment) {
        return this.service._getCommentUser(comment);
    }
    async course(comment) {
        return this.service._getCommentCourse(comment);
    }
};
__decorate([
    graphql_1.Query(() => [comment_type_1.CommentType]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CommentResolver.prototype, "getAllComments", null);
__decorate([
    graphql_1.Query(() => comment_type_1.CommentType),
    __param(0, graphql_1.Args("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CommentResolver.prototype, "getComment", null);
__decorate([
    graphql_1.ResolveField(),
    __param(0, graphql_1.Parent()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [comment_entity_1.Comment]),
    __metadata("design:returntype", Promise)
], CommentResolver.prototype, "user", null);
__decorate([
    graphql_1.ResolveField(),
    __param(0, graphql_1.Parent()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [comment_entity_1.Comment]),
    __metadata("design:returntype", Promise)
], CommentResolver.prototype, "course", null);
CommentResolver = __decorate([
    graphql_1.Resolver(of => comment_type_1.CommentType),
    __param(1, common_1.Inject(common_1.forwardRef(() => auth_provider_1.AuthProvider))),
    __metadata("design:paramtypes", [comment_service_1.CommentService,
        auth_provider_1.AuthProvider])
], CommentResolver);
exports.CommentResolver = CommentResolver;
//# sourceMappingURL=comment.resolver.js.map