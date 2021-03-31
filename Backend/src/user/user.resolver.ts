
import { Injectable, Inject, forwardRef, Logger, NotFoundException, BadRequestException } from '@nestjs/common'
import { Resolver, ResolveField, Query, Mutation, Args, Parent } from "@nestjs/graphql"

import { User } from "./model/user.entity"
import { UserService } from "./user.service"
import { UserType } from "./model/user.type"
import { UserRoles } from "./enum/user-roles.enum"

import { AuthProvider } from "../auth/auth.provider"
import { Course } from "../course/model/course.entity"
import { Comment } from "../comment/model/comment.entity"
import { LogType } from "../logger/model/log.type"


@Resolver(of => UserType)
export class UserResolver {
	constructor(
		private service: UserService,

    @Inject(forwardRef(() => AuthProvider))
    private authService: AuthProvider,
	) {}


	@Query(returns => [UserType])
	async getAllUsers() {
		return this.service.getAllUsers()
	}

	@Query(returns => UserType)
	async getUser(
		@Args("id") id: number
	) {
		return this.service.getUserById(id)
	}

	@Query(returns => UserType)
	async getAdmin() {
		return this.service.getAdmin()
	}

	@Query(returns => UserType)
	async getMe(
		@Args("token") token: string
	) {
		const user = await this.authService.authorizeByToken(token)
		return user
	}

	@Query(returns => [UserType])
	async getSubscribedUsers(
		@Args("token") token: string
	) {
		const user = await this.authService.authorizeByToken(token)
		return this.service.getSubscribedUsers(user)
	}

	@Query(returns => [UserType])
	async searchUser(
		@Args("q") q: string
	) {
		return this.service.searchUser(q)
	}


	// Sub-fields: courses, comments, purchasedCourses, savedCourses, subscriptions, logs
	@ResolveField()
	async courses(@Parent() user: User): Promise<Course[]> {
		if (user.role == UserRoles.ADMIN) return []
		return this.service._getUserCourses(user)
	}

	@ResolveField()
	async purchasedCourses(@Parent() user: User): Promise<Course[]> {
		if (user.role == UserRoles.ADMIN) return []
		return this.service._getUserPurchasedCourses(user)
	}

	@ResolveField()
	async comments(@Parent() user: User): Promise<Comment[]> {
		if (user.role == UserRoles.ADMIN) return []
		return this.service._getUserComments(user)
	}

	@ResolveField()
	async savedCourses(@Parent() user: User): Promise<Course[]> {
		if (user.role == UserRoles.ADMIN) return []
		return this.service._getUserSavedCourses(user)
	}

	@ResolveField()
	async subscriptions(@Parent() user: User): Promise<User[]> {
		if (user.role == UserRoles.ADMIN) return []
		return this.service._getUserSubscriptions(user)
	}

	@ResolveField()
	async logs(@Parent() user: User): Promise<LogType[]> {
		if (user.role == UserRoles.ADMIN) return []
		return this.service._getUserLogs(user)
	}
}