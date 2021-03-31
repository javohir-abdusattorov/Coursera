
import { Injectable, Inject, forwardRef, Logger, NotFoundException, BadRequestException } from '@nestjs/common'
import { Resolver, ResolveField, Query, Mutation, Args, Parent } from "@nestjs/graphql"

import { CategoryService } from "./category.service"
import { Category } from "./model/category.entity"
import { CategoryType } from "./model/category.type"
import { AuthProvider } from "../auth/auth.provider"
import { Course } from "../course/model/course.entity"


@Resolver(of => CategoryType)
export class CategoryResolver {
	constructor(
		private service: CategoryService,

    @Inject(forwardRef(() => AuthProvider))
    private authService: AuthProvider,
	) {}


	@Query(returns => [CategoryType])
	getAllCategories() {
		return this.service.getAllCategories()
	}

	@Query(returns => CategoryType)
	getCategory(
		@Args("id") id: number
	) {
		return this.service.getCategory(id)
	}

	@Query(() => [CategoryType])
	searchCategory(
		@Args("q") q: string
	) {
		return this.service.searchCategory(q)
	}


	// Sub-fields: courses
	@ResolveField()
	async courses(@Parent() category: Category): Promise<Course[]> {
		return this.service._getCategoryCourses(category)
	}
}