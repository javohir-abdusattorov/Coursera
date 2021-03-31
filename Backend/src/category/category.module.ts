
import { Module } from '@nestjs/common'
import { TypeOrmModule } from "@nestjs/typeorm"

import { CategoryController } from './category.controller'
import { CategoryService } from './category.service'
import { CategoryResolver } from "./category.resolver"
import { CategoryRepository } from "./model/category.repository"
import { AuthModule } from "../auth/auth.module"


@Module({
	imports: [
		AuthModule,
		TypeOrmModule.forFeature([ CategoryRepository ]),
	],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryResolver]
})
export class CategoryModule {}
