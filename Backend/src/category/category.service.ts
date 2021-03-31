
import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from "@nestjs/typeorm"

import { CategoryRepository } from "./model/category.repository"
import { Category } from "./model/category.entity"
import { CreateCategoryDto } from "./dto/create-category.dto"
import { EditCategoryDto } from "./dto/edit-category.dto"
import { Course } from "../course/model/course.entity"


@Injectable()
export class CategoryService {
	private logger = new Logger(`App:Category`)

	constructor (
		@InjectRepository(CategoryRepository)
		private Category: CategoryRepository,
	) {}


	// Queries
	async getAllCategories(): Promise<Category[]> {
		this.logger.log(`Graphql client sending query [getAllCategories]`)
		return this.Category.find()
	}

	async getCategory(id: number): Promise<Category> {
		this.logger.log(`Graphql client sending query [getCategory]. ID [${id}]`)
		const category = await this.Category.findById(id)
		return category
	}

	async searchCategory(q: string): Promise<Category[]> {
		this.logger.log(`Graphql client sending query [searchCategory]. Search by [${q}]`)
		return this.Category.searchCategory(q)
	}

	async _getCategoryCourses(category: Category): Promise<Course[]> {
		const { courses } = await this.Category.findById(category.id, ["courses"])
		return courses
	}

	// Services
	async createCategory(body: CreateCategoryDto): Promise<Category> {
		return this.Category.createCategory(body)
	}

	async editCategory(id: number, body: EditCategoryDto): Promise<Category> {
		this.logger.log(`[Admin] trying to edit category [${id}]`)
		const category = await this.Category.findById(id)
		const keys = ["name"]
		const obj = {}
		for (const key of keys) if (body[key]) obj[key] = body[key]
		if (!Object.entries(obj).length) throw new BadRequestException("No data!")

		const updatedCategory = await this.Category.updateCategory(category, obj)
		this.logger.log(`[Admin] edited category [${id}]`)
		return updatedCategory
	}
}