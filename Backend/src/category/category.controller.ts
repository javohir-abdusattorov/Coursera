
import {
	Controller, Request,
	Get, Post, Patch, Delete,
	Body, Param, Query,
	UsePipes, UseGuards, ValidationPipe, ParseIntPipe
} from '@nestjs/common'
import { AuthGuard } from "@nestjs/passport"

import { CategoryService } from "./category.service"
import { Category } from "./model/category.entity"
import { CreateCategoryDto } from "./dto/create-category.dto"
import { EditCategoryDto } from "./dto/edit-category.dto"
import { Auth } from "../auth/decorators/auth.decorator"
import { UserRoles } from "../user/enum/user-roles.enum"


@Controller('api/category')
export class CategoryController {
	constructor(private service: CategoryService) {}


	@Post("/create")
	@Auth(UserRoles.ADMIN)
	@UsePipes(ValidationPipe)
	createCategory(@Body() body: CreateCategoryDto): Promise<Category> {
		return this.service.createCategory(body)
	}

	@Patch("/edit/:id")
	@Auth(UserRoles.ADMIN)
	@UsePipes(ValidationPipe)
	editCategory(
		@Param("id", ParseIntPipe) id: number,
		@Body() body: EditCategoryDto
	): Promise<Category> {
		return this.service.editCategory(id, body)
	}
}