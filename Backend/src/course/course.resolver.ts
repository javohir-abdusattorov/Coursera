
import { Injectable, Inject, forwardRef, Logger, NotFoundException, BadRequestException } from '@nestjs/common'
import { Resolver, ResolveField, Query, Mutation, Args, Parent } from "@nestjs/graphql"

import { CourseService } from "./course.service"
import { Course } from "./model/course.entity"
import { CourseType } from "./model/course.type"
import { AuthProvider } from "../auth/auth.provider"
import { User } from "../user/model/user.entity"
import { Category } from "../category/model/category.entity"
import { Comment } from "../comment/model/comment.entity"


@Resolver(() => CourseType)
export class CourseResolver {
	constructor(
		private service: CourseService,

    @Inject(forwardRef(() => AuthProvider))
    private authService: AuthProvider,
	) {}


	@Query(() => [CourseType])
	getAllCourses() {
		return this.service.getAllCourses()
	}

	@Query(() => CourseType)
	getCourse(
		@Args("id") id: number
	) {
		return this.service.getCourse(id)
	}

	@Query(() => [CourseType])
	searchCourse(
		@Args("q") q: string
	) {
		return this.service.searchCourse(q)
	}

	@Query(() => [CourseType])
	async getMyCourses(
		@Args("token") token: string
	) {
		const user = await this.authService.authorizeByToken(token)
		return this.service.getMyCourses(user)
	}

	@Query(() => [CourseType])
	getAuthorCourses(
		@Args("author") author: number
 	) {
		return this.service.getAuthorCourses(author)
 	}

 	@Query(() => [CourseType])
 	getCategoryCourses(
 		@Args("category") category: number
 	) {
 		return this.service.getCategoryCourses(category)
 	}

 	@Query(() => [CourseType])
 	getDiscountCourses() {
 		return this.service.getDiscountCourses()
 	}

 	@Query(() => [CourseType])
 	getSavedCourses() {
 		return this.service.getSavedCourses()
 	}

 	@Query(() => [CourseType])
 	getCoursesByTags(
 		@Args({ name: "tags", type: () => [String] }) tags: String[]
 	) {
 		return this.service.getCoursesByTags(tags)
 	}

 	@Query(() => [CourseType])
 	async getFavouriteCourses(
 		@Args("token") token: string
	) {
		const user = await this.authService.authorizeByToken(token)
		return this.service.getFavouriteCourses(user)
	}


	// Sub-fields: author, category, comments, customers
	@ResolveField()
	async author(@Parent() course: Course): Promise<User> {
		return this.service._getCourseAuthor(course)
	}

	@ResolveField()
	async category(@Parent() course: Course): Promise<Category> {
		return this.service._getCourseCategory(course)
	}

	@ResolveField()
	async comments(@Parent() course: Course): Promise<Comment[]> {
		return this.service._getCourseComments(course)
	}

	@ResolveField()
	async customers(@Parent() course: Course): Promise<User[]> {
		return this.service._getCourseCustomers(course)
	}
}