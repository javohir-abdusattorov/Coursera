
import { Injectable, Inject, forwardRef, Logger, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from "@nestjs/typeorm"

import { CourseProvider } from "./course.provider"
import { Course } from "./model/course.entity"
import { CourseRepository } from "./model/course.repository"
import { CreateCourseDto } from "./dto/create-course.dto"
import { EditCourseDto } from "./dto/edit-course.dto"

import { FileService } from "../services/file.service"
import { CategoryRepository } from "../category/model/category.repository"
import { User } from "../user/model/user.entity"
import { UserProvider } from "../user/user.provider"
import { UserRepository } from "../user/model/user.repository"
import { Category } from "../category/model/category.entity"
import { Comment } from "../comment/model/comment.entity"
import { LoggerService } from "../logger/logger.service"
import { LogTypes } from "../logger/enum/log-type.enum"


@Injectable()
export class CourseService {
	private logger = new Logger(`CourseRoutes`)

	constructor (
		private provider: CourseProvider,

		@InjectRepository(CourseRepository)
		private Course: CourseRepository,

		@InjectRepository(CategoryRepository)
		private Category: CategoryRepository,

		@InjectRepository(UserRepository)
		private User: UserRepository,

    @Inject(forwardRef(() => FileService))
    private fileService: FileService,

    @Inject(forwardRef(() => UserProvider))
    private userService: UserProvider,

    @Inject(forwardRef(() => LoggerService))
    private loggerService: LoggerService,
	) {}


	// Queries
		async getAllCourses(): Promise<Course[]> {
			this.logger.log(`Graphql client sending query [getAllCourses]`)
			return this.Course.find()
		}

		async getCourse(id: number): Promise<Course> {
			this.logger.log(`Graphql client sending query [getCourse]. ID [${id}]`)
			const course = await this.Course.findById(id)
			return course
		}

		async searchCourse(q: string): Promise<Course[]> {
			this.logger.log(`Graphql client sending query [searchCourse]. Search by [${q}]`)
			return this.Course.searchCourse(q)
		}

		async getMyCourses(user: User): Promise<Course[]> {
			this.logger.log(`Graphql client sending query [getMyCourses]. User [${user.username}]`)
			return this.Course.find({ author: { id: user.id } })
		}

		async getAuthorCourses(id: number): Promise<Course[]> {
			this.logger.log(`Graphql client sending query [getAuthorCourses]. User [${id}]`)
			const { courses } = await this.User.findById(id, ["courses"])
			return courses
		}

		async getCategoryCourses(id: number): Promise<Course[]> {
			this.logger.log(`Graphql client sending query [getCategoryCourses]. Category [${id}]`)
			const { courses } = await this.Category.findById(id, ["courses"])
			return courses
		}

		async getDiscountCourses(): Promise<Course[]> {
			this.logger.log(`Graphql client sending query [getDiscountCourses]`)
			return this.Course.find({ discount: true })
		}

		async getSavedCourses(): Promise<Course[]> {
			this.logger.log(`Graphql client sending query [getDiscountCourses]`)
			return this.Course.find({ saved: true })
		}

		async getCoursesByTags(tags: String[]): Promise<Course[]> {
			this.logger.log(`Graphql client sending query [getCoursesByTags]. Tags [${tags.join(", ")}]`)
			return this.Course.searchByTags(tags)
		}

		async getFavouriteCourses(user: User): Promise<Course[]> {
			this.logger.log(`Graphql client sending query [getFavouriteCourses]. User [${user.username}]`)
			const { savedCourses } = await this.User.findById(user.id, ["savedCourses"])
			return savedCourses
		}

		async _getCourseAuthor(course: Course): Promise<User> {
			const { author } = await this.Course.findById(course.id, ["author"])
			return author
		}

		async _getCourseCategory(course: Course): Promise<Category> {
			const { category } = await this.Course.findById(course.id, ["category"])
			return category
		}

		async _getCourseComments(course: Course): Promise<Comment[]> {
			const { comments } = await this.Course.findById(course.id, ["comments"])
			return comments
		}

		async _getCourseCustomers(course: Course): Promise<User[]> {
			const { customers } = await this.Course.findById(course.id, ["customers"])
			return customers
		}


	// Services
	async createCourse(user: User, body: CreateCourseDto, files): Promise<Course> {
		this.logger.log(`User [${user.username}] trying to create course`)
		const { title, description, price, tags, category } = body
		const courseCategory = await this.Category.findById(+category)

		if (!files || !files.video) {
			this.logger.warn(`User [${user.username}] failed to create course: no video`)
			throw new BadRequestException(`Please upload course video`)
		}
		const videoFile = files.video
		if (!this.fileService.validateFileType(videoFile, "video")) {
			this.logger.warn(`User [${user.username}] failed to create course: invalid video type`)
			throw new BadRequestException(`Invalid video file type`)
		}

		if (!files.poster) {
			this.logger.warn(`User [${user.username}] failed to create course: no poster`)
			throw new BadRequestException(`Please upload course poster`)
		}
		const posterFile = files.poster
		if (!this.fileService.validateFileType(posterFile, "image")) {
			this.logger.warn(`User [${user.username}] failed to create course: invalid image type`)
			throw new BadRequestException(`Invalid image file type`)
		}

		const newCourse = await this.Course.createCourse({
			title, description, tags,
			price: +price,
			author: user,
			category: courseCategory,
			video: await this.fileService.uploadCourseVideo(videoFile),
			poster: await this.fileService.uploadCourseImage(posterFile),
		})

		this.logger.verbose(`User [${user.username}] created course. ID [${newCourse.id}]`)
		this.loggerService.log(user.id, LogTypes.SUCCESS, `You added new course! Course ID: <${newCourse.id}>. Waiting for admin to activate course`)
		return newCourse
	}

	async editCourse(user: User, id: number, body: EditCourseDto, files): Promise<Course> {
		this.logger.log(`User [${user.username}] trying to edit course [${id}]`)
		const course = await this.Course.findById(id)
		if (course.author.id !== user.id) {
			this.logger.warn(`User [${user.username}] failed to edit course: permission`)
			throw new NotFoundException(`Course not found with id ${id}`)
		}

		const fields = ["title", "description", "tags"]
		const [error, query] = await this.provider.createEditCourseQuery(course, fields, body, files)

		if (error) {
			this.logger.warn(`User [${user.username}] failed to edit course: ${error}`)
			throw new BadRequestException(error)
		}
		if (!Object.entries(query).length) {
			this.logger.warn(`User [${user.username}] failed to edit course: no data`)
			throw new BadRequestException("No data")
		}

		const updatedCourse = await this.Course.updateCourse(course, query)
		this.logger.verbose(`User [${user.username}] edited course [${id}]`)
		this.loggerService.log(user.id, LogTypes.SUCCESS, `You <edited> your course (${updatedCourse.title})`)
		return updatedCourse
	}

	async addCourseToSaved(user: User, id: number): Promise<void> {
		this.logger.log(`User [${user.username}] trying to add course [${id}] to saved`)
		const course = await this.Course.findById(id)
		user = await this.User.findById(user.id, ["savedCourses"])

		const validationResult = this.provider.canUserAddCourseToSaved(user, course)
		if (validationResult !== true) {
			this.logger.warn(`User [${user.username}] failed to add course to saved: ${validationResult}`)
			throw new BadRequestException(validationResult)
		}

		user.savedCourses.push(course)
		await user.save()
		this.logger.verbose(`User [${user.username}] added course [${id}] to saved`)
	}

	async removeCourseFromSaved(user: User, id: number): Promise<void> {
		this.logger.log(`User [${user.username}] trying to remove course [${id}] from saved`)
		const course = await this.Course.findById(id)
		user = await this.User.findById(user.id, ["savedCourses"])
		const i = user.savedCourses.findIndex(item => item.id === course.id)

		if (i < 0) {
			this.logger.warn(`User [${user.username}] failed to remove course from saved: not saved`)
			throw new BadRequestException(`You not saved course`)
		}

		user.savedCourses.splice(i, 1)
		await user.save()
		this.logger.verbose(`User [${user.username}] removed course [${id}] from saved`)
	}

	async canBuyCourse(user: User, id: number): Promise<{
		canBuy: boolean, discount: boolean, spam: boolean, price: number, discountPrice: number,
		spamPrice: number, total: number,
	}> {
		this.logger.log(`User [${user.username}] checking if he/she can buy course [${id}]`)
		const course = await this.Course.findById(id, ["customers"])

		const validationResult = this.provider.canUserBuyCourse(user, course)
		if (validationResult !== true) {
			this.logger.warn(`User [${user.username}] cannot buy course: ${validationResult}`)
			throw new BadRequestException(validationResult)
		}

		const result = this.provider.calculateCoursePriceForBuyer(course, user.account, user.spam)

		this.logger.log(`User [${user.username}] ${result.canBuy ? "can" : "cannot"} buy course [${id}]`)
		return result
	}

	async canReturnCourse(user: User, id: number): Promise<{
		canReturn: boolean, spam: boolean, price: number, spamPrice: number, total: number
	}> {
		this.logger.log(`User [${user.username}] checking if he/she can return course [${id}]`)
		const course = await this.Course.findById(id, ["customers"])
		const price = this.provider.calculateCourseReturnPrice(course, user.spam)

		const validationResult = this.provider.canUserReturnCourse(user, course, price.seller)
		if (validationResult !== true) {
			this.logger.warn(`User [${user.username}] cannot return course: ${validationResult}`)
			throw new BadRequestException(validationResult)
		}

		const result = this.provider.calculateCourseReturnPriceForBuyer(course, user.account, user.spam)

		this.logger.log(`User [${user.username}] ${result.canReturn ? "can" : "cannot"} return course [${id}]`)
		return result
	}

	async buyCourse(id: number, user: User): Promise<void> {
		this.logger.log(`User [${user.username}] trying to buy course [${id}]`)
		const course = await this.Course.findById(id, ["customers"])

		const validationResult = this.provider.canUserBuyCourse(user, course)
		if (validationResult !== true) {
			this.logger.warn(`User [${user.username}] failed to buy course: ${validationResult}`)
			throw new BadRequestException(validationResult)
		}

		const price = this.provider.calculateCoursePrice(course, user.spam)
		if (user.account < price.buyer) {
			throw new BadRequestException(`You can't buy this course. Course price is $${course.price}, you have $${user.account}`)
		}

		user = await this.userService.buyCourse(user, course.author, price, course)
		await this.provider.userBuyedCourse(course, user)

		this.logger.verbose(`User [${user.username}] purchased course [${id}]. Price [${price}]`)
		this.loggerService.log(course.author.id, LogTypes.INFO, `Your course (${course.title}) was purchased by (${user.username}). Your account has been replenished for <+$${Math.abs(price.seller)}>`)
		this.loggerService.log(user.id, LogTypes.SUCCESS, `You successfuly bought course (${course.title}). Your account has been replenished for <-$${Math.abs(price.buyer)}>`)
	}

	async returnCourse(id: number, user: User): Promise<void> {
		this.logger.log(`User [${user.username}] trying to return course [${id}]`)
		const course = await this.Course.findById(id, ["customers"])
		const price = this.provider.calculateCourseReturnPrice(course, user.spam)

		const validationResult = this.provider.canUserReturnCourse(user, course, price.seller)
		if (validationResult !== true) {
			this.logger.warn(`User [${user.username}] failed to return course: ${validationResult}`)
			throw new BadRequestException(validationResult)
		}

		user = await this.userService.returnCourse(user, course.author, price, course)
		await this.provider.userReturnedCourse(course, user)

		this.logger.verbose(`User [${user.username}] returned course [${id}]. Price [${price}]`)
		this.loggerService.log(course.author.id, LogTypes.WARN, `Your course (${course.title}) was returned by (${user.username}). Your account has been replenished for <-$${Math.abs(price.seller)}>`)
		this.loggerService.log(user.id, LogTypes.SUCCESS, `You returned course (${course.title}). Your account has been replenished for <+$${Math.abs(price.buyer)}>`)
	}

	async rateCourse(id: number, user: User, rating: number): Promise<number> {
		if (!rating || rating < 1 || rating > 5) {
			throw new BadRequestException(`Rating must be at least 1 star and max 5 star`)
		}
		this.logger.log(`User [${user.username}] trying to rate course [${id}]`)
		const course = await this.Course.findById(id, ["customers"])

		if (!course.customers.some(item => item.id === user.id)) {
			this.logger.warn(`User [${user.username}] failed to rate course: permission`)
			throw new BadRequestException(`You cannot rate courses that you are not purchased`)
		}
		const courseRating = this.provider.calculateCourseRating(course, rating)		
		const updatedCourse = await this.Course.updateCourse(course, { rating: courseRating })

		this.logger.log(`User [${user.username}] rated course [${id}]. Rating [${rating}]`)
		this.loggerService.log(course.author.id, LogTypes.INFO, `Your course (${course.title}) was rated by (${user.username}). Rating: <${rating}>`)

		return updatedCourse.rating
	}

	async activateCourse(id: number): Promise<Course> {
		this.logger.log(`[Admin] trying to active course [${id}]`)
		const course = await this.Course.findById(id)
		if (course.active) {
			this.logger.warn(`[Admin] failed to active course: already activated`)
			throw new BadRequestException("Course already activated")
		}

		const updatedCourse = await this.Course.updateCourse(course, { active: true })
		this.logger.verbose(`[Admin] activated course [${id}]`)
		this.loggerService.log(updatedCourse.author.id, LogTypes.SUCCESS, `Your course (${updatedCourse.title}) was activated. Now it is possible to <sell> the course`) 
		return updatedCourse
	}

	async disableCourse(id: number): Promise<void> {
		this.logger.log(`[Admin] trying to disable course [${id}]`)
		const course = await this.Course.findById(id)
		if (course.active) {
			this.logger.warn(`[Admin] failed to disable course: already activated`)
			throw new BadRequestException("Course already active")
		}
		await this.provider.deleteCourse(course)
		this.logger.verbose(`[Admin] deleted course [${id}]`)
		this.loggerService.log(course.author.id, LogTypes.DANGER, `Your course (${course.title}) was <deleted> by admin.`)
	}

	async toggleSaved(id: number): Promise<Course> {
		this.logger.log(`[Admin] trying to toggle saved course [${id}]`)
		const course = await this.Course.findById(id)
		const updateCourse = await this.Course.updateCourse(course, { saved: !course.saved })

		this.logger.verbose(`[Admin] toggled course saved [${id}]. Saved: ${updateCourse.saved}`)
		if (updateCourse.saved) {
			this.loggerService.log(course.author.id, LogTypes.SUCCESS, `Your course (${course.title}) was added to saved courses of admin. And your course will appear first on the main page`)
		} else {
			this.loggerService.log(course.author.id, LogTypes.WARN, `Your course (${course.title}) was removed from saved courses of admin`)
		}

		return updateCourse
	}

	async deleteCourse(id: number, user: User): Promise<void> {
		this.logger.log(`User [${user.username}] trying to delete course [${id}]`)
		const course = await this.Course.findById(id)
		if (course.author.id !== user.id) {
			this.logger.warn(`User [${user.username}] failed to delete course: permission`)
			throw new NotFoundException(`Course not found with id ${id}`)
		}
		await this.provider.deleteCourse(course)
		this.logger.verbose(`User [${user.username}] deleted course [${id}]`)
		this.loggerService.log(course.author.id, LogTypes.SUCCESS, `Your course (${course.title}) <deleted> successfuly`)
	}


	async clearDB(): Promise<void> {
		await Category.delete({})
		await Comment.delete({})
		await Course.delete({})
		await User.delete({})
	}
}