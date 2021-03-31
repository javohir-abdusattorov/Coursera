
import * as config from "config"
import * as dateEvents from "date-events"
import { Injectable, Inject, forwardRef, Logger, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from "@nestjs/typeorm"

import { Course } from "./model/course.entity"
import { CourseRepository } from "./model/course.repository"
import { EditCourseDto } from "./dto/edit-course.dto"

import { app } from "../main"
import { FileService } from "../services/file.service"
import { CategoryRepository } from "../category/model/category.repository"
import { User } from "../user/model/user.entity"
import { LoggerService } from "../logger/logger.service"
import { LogTypes } from "../logger/enum/log-type.enum"


const COURSE_RETURN_PERCENT = config.course.courseReturnPercent
const SPAM_RETURN_PERCENT = config.course.spamReturnPercent
const SPAM_PERCENT = config.course.spamPercent

@Injectable()
export class CourseProvider {
	private logger = new Logger(`CourseRoutes`)

	constructor (
		@InjectRepository(CourseRepository)
		private Course: CourseRepository,

		@InjectRepository(CategoryRepository)
		private Category: CategoryRepository,

    @Inject(forwardRef(() => FileService))
    private fileService: FileService,

    @Inject(forwardRef(() => LoggerService))
    private loggerService: LoggerService,
	) {}


	async getAllDiscountedCourses(): Promise<Course[]> {
		return this.Course.find({ discount: true })
	}

	async createEditCourseQuery(course: Course, keys: string[], body: EditCourseDto, files): Promise<any[]> {
		const query = {}
		for (const key of keys) if (body[key]) query[key] = body[key]

		if (body.price) {
			query["price"] = +body.price
		}

		if (body.category && +body.category !== course.category.id) {
			query["category"] = await this.Category.findById(+body.category)
		}

		if (body.discount == true) {
			if (!body.discountPercent || !body.discountDeadline) return [`If you want to make discount, please send discount percent and discount deadline`]
			if (new Date() > body.discountDeadline) return [`Invalid discount date`]

			query["discount"] = true
			query["discountPercent"] = body.discountPercent
			query["discountDeadline"] = new Date(body.discountDeadline).getTime()
		} else if (body.discount == false) {
			query["discount"] = false
			query["discountPercent"] = 0
			query["discountDeadline"] = 0
		}

		if (files && files.video) {
			const videoFile = files.video
			if (!this.fileService.validateFileType(videoFile, "video")) return [`Invalid video file type`]

			this.fileService.deleteFiles([ course.video ])
			query["video"] = await this.fileService.uploadCourseVideo(videoFile)
		}

		if (files && files.poster) {
			const posterFile = files.poster
			if (!this.fileService.validateFileType(posterFile, "image")) return [`Invalid poster file type`]

			this.fileService.deleteFiles([ course.poster ])
			query["poster"] = await this.fileService.uploadCourseImage(posterFile)
		}

		return [false, query]
	}

	canUserBuyCourse(user: User, course: Course): string | boolean {
		if (!course.active) {
			return `Course not found with id "${course.id}"`
		}
		if (user.id === course.author.id) {
			return `Course added by yourself`
		}
		if (course.customers.some(item => item.id === user.id)) {
			return `You have this course`
		}

		return true
	}

	canUserReturnCourse(user: User, course: Course, price: number): string | boolean {
		if (user.id === course.author.id) {
			return `Course added by yourself`
		}
		if (!course.customers.some(item => item.id === user.id)) {
			return `You doesn't have this course`
		}
		if (course.author.account < price) {
			return `Seller cannot return $${price}`
		}

		return true
	}

	canUserAddCourseToSaved(user: User, course: Course): string | boolean {
		if (!course.active) {
			return `Course not found with id "${course.id}"`
		}
		if (user.savedCourses.some(item => item.id === course.id)) {
			return `You already saved course`
		}

		return true
	}

	async userBuyedCourse(course: Course, user: User): Promise<void> {
		course.customers.push(user)
		course.sold++
		await course.save()
	}

	async userReturnedCourse(course: Course, user: User): Promise<void> {
		const i = course.customers.findIndex(item => item.id === user.id)
		course.customers.splice(i, 1)
		await course.save()
	}

	calculateCoursePrice(course: Course, isSpam: boolean): {
		buyer: number, seller: number, admin: number
	} {
		const coursePrice = this.round(course.discount ? course.price - ((course.price / 100) * course.discountPercent) : course.price, 1)

		if (isSpam) {
			const add = this.round((coursePrice / 100) * SPAM_PERCENT, 1)
			return {
				buyer: this.round(-(coursePrice + add), 1),
				seller: coursePrice,
				admin: add
			}
		} else {
			return {
				buyer: -coursePrice,
				seller: coursePrice,
				admin: 0
			}
		}
	}

	calculateCourseReturnPrice(course: Course, isSpam: boolean): {
		buyer: number, seller: number, admin: number
	} {
		const returnPrice = this.round(course.price - ((course.price / 100) * COURSE_RETURN_PERCENT), 1)

		if (isSpam) {
			const add = this.round((returnPrice / 100) * SPAM_RETURN_PERCENT, 1)
			return {
				seller: -returnPrice,
				buyer: this.round(returnPrice - add, 1),
				admin: add,
			}
		} else {
			return {
				seller: -returnPrice,
				buyer: returnPrice,
				admin: 0,
			}
		}
	}

	calculateCoursePriceForBuyer(course: Course, buyerAccount: number, isSpam: boolean): {
		canBuy: boolean, discount: boolean, spam: boolean, price: number, discountPrice: number, spamPrice: number, total: number
	} {
		const result = {
			discount: false,
			spam: false,
			price: course.price,
			discountPrice: 0,
			spamPrice: 0,
			total: 0,
			canBuy: false,
		}

		if (course.discount) {
			result.discountPrice = this.round((course.price / 100) * course.discountPercent, 1)
			result.discount = true
		}
		if (isSpam) {
			const currentPrice = result.discount ? result.price - result.discountPrice : result.price
			result.spamPrice = this.round((currentPrice / 100) * SPAM_PERCENT, 1)
			result.spam = true
		}

		result.total = (result.price - result.discountPrice) + result.spamPrice
		if (buyerAccount >= result.total) result.canBuy = true
		return result
	}

	calculateCourseReturnPriceForBuyer(course: Course, authorAccount: number, isSpam: boolean): {
		canReturn: boolean, spam: boolean, price: number, spamPrice: number, total: number
	} {
		const result = {
			price: this.round(course.price - ((course.price / 100) * COURSE_RETURN_PERCENT), 1),
			spam: false,
			spamPrice: 0,
			total: 0,
			canReturn: false,
		}

		if (isSpam) {
			result.spamPrice = this.round((result.price / 100) * SPAM_RETURN_PERCENT, 1)
			result.spam = true
		}

		result.total = result.price - result.spamPrice
		if (authorAccount >= result.price) result.canReturn = true
		return result
	}

	calculateCourseRating(course: Course, rate: number): number {
		if (course.rating == 0) return this.round((rate * 2) / 2)

		const rating = (course.rating + rate) / 2
		return this.round((rating * 2) / 2)
	}

	async endCoursesDiscount(date: Date): Promise<void> {
		const all: Course[] = await this.getAllDiscountedCourses()

		for (const course of all) {
			if (new Date(+course.discountDeadline) <= date) {
				await this.removeCourseDiscount(course)
				this.loggerService.log(course.author.id, LogTypes.WARN, `Your course (${course.title})'s discount ended`)
			}
		}
	}

	async removeCourseDiscount(course: Course): Promise<void> {
		await this.Course.updateCourse(course, {
			discount: false,
			discountPercent: 0,
			discountDeadline: 0,
		})
	}

	async deleteCourse(course: Course): Promise<void> {
		this.fileService.deleteFiles([ course.video, course.poster ])
		// Delete all comments X
		await course.remove()
	}

	round(value: number, precision: number = 0): number {
    const multiplier = Math.pow(10, precision || 0)
    return Math.round(value * multiplier) / multiplier
	}
}


const clock = dateEvents()
const per = config.course.checkDiscountMinute

// clock.on("minute", async (min) => {
// 	// if (min != 0 && min % per != 0) return

// 	const date = new Date()
// 	const service = app.get(CourseProvider)
// 	await service.endCoursesDiscount(date)
// })

clock.on("second", async () => {
	if (!app) return;
	const sec = new Date().getSeconds()
	if (sec !== 30 && sec !== 0) return

	const date = new Date()
	const service = app.get(CourseProvider)
	await service.endCoursesDiscount(date)
})