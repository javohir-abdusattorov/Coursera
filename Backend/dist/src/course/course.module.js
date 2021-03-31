"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const course_controller_1 = require("./course.controller");
const course_service_1 = require("./course.service");
const course_provider_1 = require("./course.provider");
const course_resolver_1 = require("./course.resolver");
const course_repository_1 = require("./model/course.repository");
const auth_module_1 = require("../auth/auth.module");
const logger_module_1 = require("../logger/logger.module");
const services_module_1 = require("../services/services.module");
const category_repository_1 = require("../category/model/category.repository");
const user_repository_1 = require("../user/model/user.repository");
const user_module_1 = require("../user/user.module");
let CourseModule = class CourseModule {
};
CourseModule = __decorate([
    common_1.Module({
        imports: [
            user_module_1.UserModule,
            auth_module_1.AuthModule,
            services_module_1.ServicesModule,
            logger_module_1.LoggerModule,
            typeorm_1.TypeOrmModule.forFeature([course_repository_1.CourseRepository, category_repository_1.CategoryRepository, user_repository_1.UserRepository]),
        ],
        controllers: [course_controller_1.CourseController],
        providers: [course_service_1.CourseService, course_provider_1.CourseProvider, course_resolver_1.CourseResolver]
    })
], CourseModule);
exports.CourseModule = CourseModule;
//# sourceMappingURL=course.module.js.map