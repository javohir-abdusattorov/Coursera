"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const comment_controller_1 = require("./comment.controller");
const comment_service_1 = require("./comment.service");
const comment_resolver_1 = require("./comment.resolver");
const comment_repository_1 = require("./model/comment.repository");
const auth_module_1 = require("../auth/auth.module");
const logger_module_1 = require("../logger/logger.module");
const course_repository_1 = require("../course/model/course.repository");
let CommentModule = class CommentModule {
};
CommentModule = __decorate([
    common_1.Module({
        imports: [
            auth_module_1.AuthModule,
            logger_module_1.LoggerModule,
            typeorm_1.TypeOrmModule.forFeature([comment_repository_1.CommentRepository, course_repository_1.CourseRepository]),
        ],
        controllers: [comment_controller_1.CommentController],
        providers: [comment_service_1.CommentService, comment_resolver_1.CommentResolver]
    })
], CommentModule);
exports.CommentModule = CommentModule;
//# sourceMappingURL=comment.module.js.map