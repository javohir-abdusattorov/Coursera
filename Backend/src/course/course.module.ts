
import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common'
import { TypeOrmModule } from "@nestjs/typeorm"

import { CourseController } from './course.controller'
import { CourseService } from './course.service'
import { CourseProvider } from "./course.provider"
import { CourseResolver } from "./course.resolver"
import { CourseRepository } from "./model/course.repository"

import { AuthModule } from "../auth/auth.module"
import { LoggerModule } from "../logger/logger.module"
import { ServicesModule } from "../services/services.module"
import { CategoryRepository } from "../category/model/category.repository"
import { UserRepository } from "../user/model/user.repository"
import { UserModule } from "../user/user.module"


@Module({
	imports: [
		UserModule,
		AuthModule,
		ServicesModule,
		LoggerModule,
		TypeOrmModule.forFeature([ CourseRepository, CategoryRepository, UserRepository ]),
	],
  controllers: [CourseController],
  providers: [CourseService, CourseProvider, CourseResolver]
})
export class CourseModule {}
