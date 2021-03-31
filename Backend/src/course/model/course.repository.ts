
import { Logger, BadRequestException, NotFoundException } from "@nestjs/common"
import { EntityRepository, Repository } from "typeorm"

import { Course } from "./course.entity"
import { User } from "../../user/model/user.entity"
import { Category } from "../../category/model/category.entity"


@EntityRepository(Course)
export class CourseRepository extends Repository<Course> {
	private logger = new Logger(`CourseRoutes`)


	async findById(id: number, relations: string[] = []): Promise<Course> {
		const course = await this.findOne({ where: { id }, relations })
		if (!course) {
			this.logger.warn(`Course not found. ID [${id}]`)
			throw new NotFoundException(`Course not found with id "${id}"`)
		}
		return course
	}

	async searchCourse(q: string): Promise<Course[]> {
		const query = this.createQueryBuilder("course")
		query.where(`(course.title LIKE :search OR course.description LIKE :search)`, { search: `%${q}%` })
		return query.getMany()
	}

	async searchByTags(tags: String[]): Promise<Course[]> {
		const query = this.createQueryBuilder("course")
		query.where(`course.tags @> ARRAY[:...tags]`, { tags })
		return query.getMany()
	}

	async createCourse(body: {
		title: string,
		description: string,
		price: number,
		video: string,
		poster: string,
		tags: string[],
		author: User,
		category: Category,
	}): Promise<Course> {
		this.logger.log(`User creating. Title [${body.title}]`)
		const newCourse = new Course()
		for (const [key, value] of Object.entries(body)) newCourse[key] = value

		try { await newCourse.save() }
		catch (err) {
			this.logger.warn(`Failed to create course`, err)
			throw new BadRequestException("Invalid data!")			
		}
		return newCourse
	}

	async updateCourse(course: Course, body: Object): Promise<Course> {
		for (const [key, value] of Object.entries(body)) course[key] = value
		try { await course.save() }
		catch (err) {
			this.logger.warn(`Failed to update course [${course.id}]`, err)
			throw new BadRequestException("Invalid data!")
		}
		return course
	}
}