
import { Injectable, Inject, forwardRef, Logger, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from "@nestjs/typeorm"

import { CommentRepository } from "./model/comment.repository"
import { Comment } from "./model/comment.entity"
import { CreateCommentDto } from "./dto/create-comment.dto"
import { EditCommentDto } from "./dto/edit-comment.dto"

import { User } from "../user/model/user.entity"
import { Course } from "../course/model/course.entity"
import { CourseRepository } from "../course/model/course.repository"
import { LoggerService } from "../logger/logger.service"
import { LogTypes } from "../logger/enum/log-type.enum"


@Injectable()
export class CommentService {
	private logger = new Logger(`CommentRoutes`)

	constructor (
		@InjectRepository(CommentRepository)
		private Comment: CommentRepository,

		@InjectRepository(CourseRepository)
		private Course: CourseRepository,

    @Inject(forwardRef(() => LoggerService))
    private loggerService: LoggerService,
	) {}


	// Queries
	async getAllComments(): Promise<Comment[]> {
		this.logger.log(`Graphql client sending query [getAllComments]`)
		return this.Comment.find()
	}

	async getComment(id: number): Promise<Comment> {
		this.logger.log(`Graphql client sending query [getComment]. ID [${id}]`)
		return this.Comment.findById(id)
	}

	async _getCommentUser(comment: Comment): Promise<User> {
		const { user } = await this.Comment.findById(comment.id, ["user"])
		return user
	}

	async _getCommentCourse(comment: Comment): Promise<Course> {
		const { course } = await this.Comment.findById(comment.id, ["course"])
		return course
	}

	// Service
	async postComment(user: User, id: number, body: CreateCommentDto): Promise<Comment> {
		this.logger.log(`User [${user.username}] trying to post comment to course [${id}]`)
		const course = await this.Course.findById(id, ["customers"])
		if (user.spam) {
			this.logger.warn(`User [${user.username}] failed to post comment: user is spammed`)
			throw new BadRequestException(`You are cannot post comment`)
		}
		if (!course.customers.some(item => item.id === user.id)) {
			this.logger.warn(`User [${user.username}] failed to post comment: user doesn't have course`)
			throw new BadRequestException(`You doesn't have this course`)
		}

		const createdComment = await this.Comment.createComment(body, user, course)
		this.logger.verbose(`User [${user.username}] posted comment to course [${id}]`)
		this.loggerService.log(course.author.id, LogTypes.INFO, `User (${user.username}) posted <comment> to your course (${course.title}). Message: "${body.message}"`)

		return createdComment
	}

	async editComment(user: User, id: number, body: EditCommentDto): Promise<Comment> {
		this.logger.log(`User [${user.username}] trying to edit comment [${id}]`)
		const comment = await this.Comment.findById(id, ["user"])

		if (comment.user.id !== user.id) {
			this.logger.warn(`User [${user.username}] failed to edit comment: permission`)
			throw new BadRequestException(`Not your comment`)
		}
		if (body.message == comment.message) {
			this.logger.warn(`User [${user.username}] failed to edit comment: message same`)
			throw new BadRequestException(`Same message`)
		}

		const updatedComment = await this.Comment.updateComment(comment, { message: body.message })
		this.logger.verbose(`User [${user.username}] edited comment [${id}]`)
		return updatedComment
	}

	async deleteComment(user: User, id: number): Promise<void> {
		this.logger.log(`User [${user.username}] trying to delete comment [${id}]`)
		const comment = await this.Comment.findById(id, ["user"])
		if (comment.user.id !== user.id) {
			this.logger.warn(`User [${user.username}] failed to delete comment: permission`)
			throw new BadRequestException(`Not your comment`)
		}
		await comment.remove()
		this.logger.verbose(`User [${user.username}] deleted comment [${id}]`)
	}

	async deleteCommentByAdmin(id: number): Promise<void> {
		const comment = await this.Comment.findById(id)
		await comment.remove()
		this.logger.verbose(`[Admin] deleted comment [${id}]`)
	}

}