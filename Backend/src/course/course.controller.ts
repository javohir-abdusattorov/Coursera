
import {
	Controller, Request, Response,
	Get, Post, Patch, Delete,
	Body, Param, Query,
	UsePipes, UseGuards, UseInterceptors,
	SetMetadata, ValidationPipe, ParseIntPipe
} from '@nestjs/common'

import { CourseService } from "./course.service"
import { Course } from "./model/course.entity"
import { CreateCourseDto } from "./dto/create-course.dto"
import { EditCourseDto } from "./dto/edit-course.dto"
import { RequestUser } from "../auth/decorators/request-user.decorator"
import { User } from "../user/model/user.entity"
import { UserRoles } from "../user/enum/user-roles.enum"
import { Auth } from "../auth/decorators/auth.decorator"
import { ParserGuard } from "../services/middlewares/parse-request.middleware"
import { Parser } from "../services/decorators/parser.decorator"


@Controller('api/courses')
@UseGuards(ParserGuard)
export class CourseController {
	constructor(private service: CourseService) {}


	// Creator routes
	@Post("/create")
	@Auth(UserRoles.USER)
	@Parser([ "price::number", "tags::json", "category::number" ])
	@UsePipes(ValidationPipe)
	createCourse(
		@Request() req,
		@RequestUser() user: User,
		@Body() body: CreateCourseDto
	): Promise<Course> {
		return this.service.createCourse(user, body, req.files)
	}

	@Patch("/edit/:id")
	@Auth(UserRoles.USER)
	@Parser([
		"price::number",
		"tags::json",
		"category::number",
		"discount::json",
		"discountPercent::number",
		"discountDeadline::date"
	])
	@UsePipes(ValidationPipe)
	editCourse(
		@Request() req,
		@RequestUser() user: User,
		@Param("id", ParseIntPipe) id: number,
		@Body() body: EditCourseDto
	): Promise<Course> {
		return this.service.editCourse(user, id, body, req.files)
	}

	@Delete("/delete/:id")
	@Auth(UserRoles.USER)
	@UsePipes(ValidationPipe)
	deleteCourse(
		@RequestUser() user: User,
		@Param("id", ParseIntPipe) id: number,
	): Promise<void> {
		return this.service.deleteCourse(id, user)
	}

	// Customer routes
	@Post("/add-saved/:id")
	@Auth(UserRoles.USER)
	addCourseToSaved(
		@RequestUser() user: User,
		@Param("id", ParseIntPipe) id: number,
	): Promise<void> {
		return this.service.addCourseToSaved(user, id)
	}

	@Post("/remove-saved/:id")
	@Auth(UserRoles.USER)
	removeCourseFromSaved(
		@RequestUser() user: User,
		@Param("id", ParseIntPipe) id: number,
	): Promise<void> {
		return this.service.removeCourseFromSaved(user, id)
	}

	@Post("/can-buy/:id")
	@Auth(UserRoles.USER)
	canBuyCourse(
		@Param("id", ParseIntPipe) id: number,
		@RequestUser() user: User,
	): Promise<{
		canBuy: boolean, discount: boolean, spam: boolean, price: number, discountPrice: number,
		spamPrice: number, total: number,
	}> {
		return this.service.canBuyCourse(user, id)
	}

	@Post("/can-return/:id")
	@Auth(UserRoles.USER)
	canReturnCourse(
		@Param("id", ParseIntPipe) id: number,
		@RequestUser() user: User,
	): Promise<{
		canReturn: boolean, spam: boolean, price: number, spamPrice: number, total: number
	}> {
		return this.service.canReturnCourse(user, id)
	}

	@Post("/buy/:id")
	@Auth(UserRoles.USER)
	buyCourse(
		@Param("id", ParseIntPipe) id: number,
		@RequestUser() user: User,
	): Promise<void> {
		return this.service.buyCourse(id, user)
	}

	@Delete("/return/:id")
	@Auth(UserRoles.USER)
	returnCourse(
		@Param("id", ParseIntPipe) id: number,
		@RequestUser() user: User,
	): Promise<void> {
		return this.service.returnCourse(id, user)
	}

	@Patch("/rate/:id")
	@Auth(UserRoles.USER)
	rateCourse(
		@Param("id", ParseIntPipe) id: number,
		@RequestUser() user: User,
		@Body("rating", ParseIntPipe) rating: number,
	): Promise<number> {
		return this.service.rateCourse(id, user, rating)
	}


	// Admin routes
	@Post("/activate-course/:id")
	@Auth(UserRoles.ADMIN)
	activateCourse(
		@Param("id", ParseIntPipe) id: number,
	): Promise<Course> {
		return this.service.activateCourse(id)
	}

	@Post("/disable-course/:id")
	@Auth(UserRoles.ADMIN)
	disableCourse(
		@Param("id", ParseIntPipe) id: number,
	): Promise<void> {
		return this.service.disableCourse(id)
	}

	@Patch("/toggle-saved/:id")
	@Auth(UserRoles.ADMIN)
	toggleSaved(
		@Param("id", ParseIntPipe) id: number,
	): Promise<Course> {
		return this.service.toggleSaved(id)
	}


	@Get("/delete/all")
	clearDB(): Promise<void> {
		return this.service.clearDB()
	}

}