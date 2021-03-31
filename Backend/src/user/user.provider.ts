
import * as config from "config"
import { Injectable, Inject, forwardRef, Logger, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from "@nestjs/typeorm"

import { UserRepository } from "./model/user.repository"
import { User } from "./model/user.entity"
import { UserRoles } from "./enum/user-roles.enum"
import { Course } from "../course/model/course.entity"
import { EditUserDto } from "./dto/edit-user.dto"
import { AuthProvider } from "../auth/auth.provider"
import { FileService } from "../services/file.service"


@Injectable()
export class UserProvider {
	private logger = new Logger(`App:Users`)

	constructor (
		@InjectRepository(UserRepository)
		private User: UserRepository,

    @Inject(forwardRef(() => AuthProvider))
    private authService: AuthProvider,

    @Inject(forwardRef(() => FileService))
    private fileService: FileService,
	) {}


	async createEditUserQuery(fields: string[], user: User, body: EditUserDto, files): Promise<any[]> {
		const query = {}
		for (const key of fields) if (body[key]) query[key] = body[key]

    if (body.oldPassword && body.newPassword) {
      const isMatch = await this.authService.checkPassword(body.oldPassword, user.password)
      if (!isMatch) return [`Invalid password`]

      query["password"] = await this.authService.hashPassword(body.newPassword)
    }

    if (files && files.profilePicture) {
			const image = files.profilePicture
			if (!this.fileService.validateFileType(image, "image")) return [`Invalid profile picture file type`]

			if (user.profilePicture !== config.user.defaultImage) {
				this.fileService.deleteFiles([ user.profilePicture ])
			}
			query["profilePicture"] = await this.fileService.uploadUserImage(image)
    }

    return [false, query]
	}

	canUserSubscribe(user: User, channel: User): string | boolean {
		if (channel.spam) {
			return `Channel in spam`
		}
		if (user.subscriptions.some(item => item.id == channel.id)) {
			return `You already subscribed`
		}

		return true
	}

	async buyCourse(buyer: User, seller: User, price: {
		buyer: number, seller: number, admin: number
	}, course: Course): Promise<User> 
	{
		const admin = await this.User.findAdmin()
		buyer = await this.User.findOne({ where: { id: buyer.id }, relations: ["purchasedCourses"] })
		buyer.purchasedCourses.push(course)

		buyer.account += price.buyer
		seller.account += price.seller
		admin.account += price.admin

		await buyer.save()
		await seller.save()
		await admin.save()

		return buyer
	}

	async returnCourse(buyer: User, seller: User, price: {
		buyer: number, seller: number, admin: number
	}, course: Course): Promise<User> 
	{
		const admin = await this.User.findAdmin()
		buyer = await this.User.findOne({ where: { id: buyer.id }, relations: ["purchasedCourses"] })
		const i = buyer.purchasedCourses.findIndex(item => item.id === course.id)
		buyer.purchasedCourses.splice(i, 1)

		buyer.account += price.buyer
		seller.account += price.seller
		admin.account += price.admin

		await buyer.save()
		await seller.save()
		await admin.save()

		return buyer
	}
}