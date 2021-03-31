
import { Logger, BadRequestException, NotFoundException } from "@nestjs/common"
import { EntityRepository, Repository } from "typeorm"

import { Comment } from "./comment.entity"
import { CreateCommentDto } from "../dto/create-comment.dto"
import { User } from "../../user/model/user.entity"
import { Course } from "../../course/model/course.entity"


@EntityRepository(Comment)
export class CommentRepository extends Repository<Comment> {
	private logger = new Logger(`CommentRoutes`)


	async findById(id: number, relations: string[] = []): Promise<Comment> {
		const comment = await this.findOne({ where: { id }, relations })
		if (!comment) {
			this.logger.warn(`Comment not found. ID [${id}]`)
			throw new NotFoundException(`Comment not found with id "${id}"`)
		}
		return comment
	}

	async createComment(body: CreateCommentDto, user: User, course: Course): Promise<Comment> {
		const { message } = body
		const newComment = new Comment()

		newComment.message = message
		newComment.user = user
		newComment.course = course

		try { await newComment.save() }
		catch (err) {
			this.logger.warn(`Failed to create comment`, err)
			throw new BadRequestException("Invalid data!")			
		}

		return newComment
	}

	async updateComment(comment: Comment, body: Object): Promise<Comment> {
		for (const [key, value] of Object.entries(body)) comment[key] = value
		try { await comment.save() }
		catch (err) {
			this.logger.warn(`Failed to edit comment`, err)
			throw new BadRequestException("Invalid data!")
		}
		return comment
	}
}