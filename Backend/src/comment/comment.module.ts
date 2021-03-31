
import { Module } from '@nestjs/common'
import { TypeOrmModule } from "@nestjs/typeorm"

import { CommentController } from './comment.controller'
import { CommentService } from './comment.service'
import { CommentResolver } from "./comment.resolver"
import { CommentRepository } from "./model/comment.repository"

import { AuthModule } from "../auth/auth.module"
import { LoggerModule } from "../logger/logger.module"
import { CourseRepository } from "../course/model/course.repository"


@Module({
	imports: [
		AuthModule,
		LoggerModule,
		TypeOrmModule.forFeature([ CommentRepository, CourseRepository ]),
	],
  controllers: [CommentController],
  providers: [CommentService, CommentResolver]
})
export class CommentModule {}
