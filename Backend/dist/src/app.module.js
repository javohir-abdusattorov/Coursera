"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const graphql_1 = require("@nestjs/graphql");
const typeorm_config_1 = require("../config/typeorm.config");
const graphql_config_1 = require("../config/graphql.config");
const user_module_1 = require("./user/user.module");
const auth_module_1 = require("./auth/auth.module");
const course_module_1 = require("./course/course.module");
const category_module_1 = require("./category/category.module");
const comment_module_1 = require("./comment/comment.module");
const services_module_1 = require("./services/services.module");
const logger_module_1 = require("./logger/logger.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forRoot(typeorm_config_1.TypeOrmConfig),
            graphql_1.GraphQLModule.forRoot(graphql_config_1.GraphqlConfig),
            user_module_1.UserModule,
            auth_module_1.AuthModule,
            course_module_1.CourseModule,
            category_module_1.CategoryModule,
            comment_module_1.CommentModule,
            services_module_1.ServicesModule,
            logger_module_1.LoggerModule
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map