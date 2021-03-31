
import { Injectable, Inject, forwardRef, Logger, NotFoundException, BadRequestException } from '@nestjs/common'
import { Resolver, ResolveField, Query, Mutation, Args, Parent } from "@nestjs/graphql"

import { CommentService } from "./comment.service"
import { Comment } from "./model/comment.entity"
import { CommentType } from "./model/comment.type"
import { AuthProvider } from "../auth/auth.provider"
import { User } from "../user/model/user.entity"
import { Course } from "../course/model/course.entity"


@Resolver(of => CommentType)
export class CommentResolver {
	constructor(
		private service: CommentService,

    @Inject(forwardRef(() => AuthProvider))
    private authService: AuthProvider,
	) {}


	@Query(() => [CommentType])
	getAllComments() {
		return this.getAllComments()
	}

	@Query(() => CommentType)
	getComment(
		@Args("id") id: number
	) {
		return this.getComment(id)
	}


	// Sub-fields: user, course
	@ResolveField()
	async user(@Parent() comment: Comment): Promise<User> {
		return this.service._getCommentUser(comment)
	}

	@ResolveField()
	async course(@Parent() comment: Comment): Promise<Course> {
		return this.service._getCommentCourse(comment)
	}
}