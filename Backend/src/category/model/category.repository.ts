
import { Logger, BadRequestException, NotFoundException, ConflictException } from "@nestjs/common"
import { EntityRepository, Repository } from "typeorm"

import { Category } from "./category.entity"
import { CreateCategoryDto } from "../dto/create-category.dto"


@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {
	private logger = new Logger(`App:Category`)


	async findById(id: number, relations: string[] = []): Promise<Category> {
		const category = await this.findOne({ where: { id }, relations })
		if (!category) {
			this.logger.warn(`Category not found. ID [${id}]`)
			throw new NotFoundException(`Category not found with id "${id}"`)
		}
		return category
	}

	async searchCategory(q: string): Promise<Category[]> {
		const query = this.createQueryBuilder("category")
		query.where(`(category.name LIKE :search)`, { search: `%${q}%` })
		return query.getMany()
	}

	async createCategory(body: CreateCategoryDto): Promise<Category> {
		const { name } = body
		this.logger.log(`[Admin] trying to create category. Name [${name}]`)
		const newCategory = new Category()
		newCategory.name = name

		try { await newCategory.save() }
		catch (err) {
			if (err.code === "23505") {
				this.logger.warn(`[Admin] failed to create category: name conflict`)
				throw new ConflictException(`Category with name "${name}" already exists. Try another one`)
			}	else {
				this.logger.warn(`[Admin] failed to create category`, err)
				throw new BadRequestException("Invalid data!")
			}			
		}

		return newCategory
	}

	async updateCategory(category: Category, body: Object): Promise<Category> {
		for (const [key, value] of Object.entries(body)) category[key] = value
		try { await category.save() }
		catch (err) {
			this.logger.warn(`[Admin] failed to edit category`, err)
			throw new BadRequestException("Invalid data!")
		}
		return category
	}
}