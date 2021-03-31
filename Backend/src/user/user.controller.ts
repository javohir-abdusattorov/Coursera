
import {
	Controller, Request, 
	Get, Post, Patch, Delete,
	Body, Param, Query,
	UsePipes, UseGuards, ValidationPipe, ParseIntPipe, SetMetadata
} from '@nestjs/common'
import { AuthGuard } from "@nestjs/passport"

import { UserService } from "./user.service"
import { User } from "./model/user.entity"
import { RequestUser } from "../auth/decorators/request-user.decorator"
import { Auth } from "../auth/decorators/auth.decorator"
import { EditUserDto } from "./dto/edit-user.dto"
import { UserRoles } from "./enum/user-roles.enum"


@Controller('api/users')
export class UserController {
	constructor(private service: UserService) {}


	@Post("/subscribe/:id")
	@Auth(UserRoles.USER)
	subscribe(
		@RequestUser() user: User,
		@Param("id", ParseIntPipe) id: number,
	): Promise<void> {
		return this.service.subscribe(user, id)
	}

	@Post("/unsubscribe/:id")
	@Auth(UserRoles.USER)
	unsubscribe(
		@RequestUser() user: User,
		@Param("id", ParseIntPipe) id: number,
	): Promise<void> {
		return this.service.unsubscribe(user, id)
	}

	@Patch("/edit")
	@UseGuards(AuthGuard())
	@UsePipes(ValidationPipe)
	editUser(
		@Request() req,
		@RequestUser() user: User,
		@Body() body: EditUserDto
	): Promise<User> {
		return this.service.editUser(user, body, req.files)
	}

	@Patch("/toggle-spam/:id")
	@Auth(UserRoles.ADMIN)
	@UsePipes(ValidationPipe)
	toggleSaved(
		@Param("id", ParseIntPipe) id: number,
	): Promise<User> {
		return this.service.toggleSpam(id)
	}


	@Get("/create-admin")
	@UsePipes(ValidationPipe)
	createAdmin(): Promise<{
		user: User,
		accessToken: string
	}> {
		return this.service.createAdmin()
	}
}