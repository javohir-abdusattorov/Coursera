
import {
	Controller, Request,
	Get, Post, Patch, Delete,
	Body, Param, Query,
	UsePipes, UseGuards, ValidationPipe, ParseIntPipe
} from '@nestjs/common'

import { CommentService } from "./comment.service"
import { Comment } from "./model/comment.entity"
import { CreateCommentDto } from "./dto/create-comment.dto"
import { EditCommentDto } from "./dto/edit-comment.dto"
import { RequestUser } from "../auth/decorators/request-user.decorator"
import { User } from "../user/model/user.entity"
import { UserRoles } from "../user/enum/user-roles.enum"
import { Auth } from "../auth/decorators/auth.decorator"
import { ParserGuard } from "../services/middlewares/parse-request.middleware"
import { Parser } from "../services/decorators/parser.decorator"


@Controller("api/comments")
export class CommentController {
	constructor(private service: CommentService) {}


	@Post("/create/:id")
	@Auth(UserRoles.USER)
	@UsePipes(ValidationPipe)
	postComment(
		@Param("id", ParseIntPipe) id: number,
		@RequestUser() user: User,
		@Body() body: CreateCommentDto
	): Promise<Comment> {
		return this.service.postComment(user, id, body)
	}

	@Patch("/edit/:id")
	@Auth(UserRoles.USER)
	@UsePipes(ValidationPipe)
	editComment(
		@Param("id", ParseIntPipe) id: number,
		@RequestUser() user: User,
		@Body() body: EditCommentDto
	): Promise<Comment> {
		return this.service.editComment(user, id, body)
	}

	@Delete("/delete/:id")
	@Auth(UserRoles.USER)
	deleteComment(
		@Param("id", ParseIntPipe) id: number,
		@RequestUser() user: User,
	): Promise<void> {
		return this.service.deleteComment(user, id)
	}

	@Delete("/admin-delete/:id")
	@Auth(UserRoles.ADMIN)
	deleteCommentByAdmin(
		@Param("id", ParseIntPipe) id: number,
	): Promise<void> {
		return this.service.deleteCommentByAdmin(id)
	}
}