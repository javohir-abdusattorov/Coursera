
import { Module } from '@nestjs/common'
import { TypeOrmModule } from "@nestjs/typeorm"
import { GraphQLModule } from "@nestjs/graphql"

import { TypeOrmConfig } from "../config/typeorm.config"
import { GraphqlConfig } from "../config/graphql.config"

import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { CourseModule } from './course/course.module'
import { CategoryModule } from './category/category.module'
import { CommentModule } from './comment/comment.module'
import { ServicesModule } from './services/services.module'
import { LoggerModule } from "./logger/logger.module"


@Module({
  imports: [
  	TypeOrmModule.forRoot(TypeOrmConfig),
    GraphQLModule.forRoot(GraphqlConfig),

  	UserModule,
  	AuthModule,
  	CourseModule,
  	CategoryModule,
  	CommentModule,
  	ServicesModule,
    LoggerModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
