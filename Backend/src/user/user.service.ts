
import { Injectable, Inject, forwardRef, Logger, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from "@nestjs/typeorm"

import { UserProvider } from "./user.provider"
import { UserRepository } from "./model/user.repository"
import { User } from "./model/user.entity"
import { EditUserDto } from "./dto/edit-user.dto"
import { UserRoles } from "./enum/user-roles.enum"

import { AuthProvider } from "../auth/auth.provider"
import { Course } from "../course/model/course.entity"
import { Comment } from "../comment/model/comment.entity"
import { LogType } from "../logger/model/log.type"
import { LoggerService } from "../logger/logger.service"
import { LogTypes } from "../logger/enum/log-type.enum"


@Injectable()
export class UserService {
	private logger = new Logger(`App:Users`)

	constructor (
		private provider: UserProvider,

		@InjectRepository(UserRepository)
		private User: UserRepository,

    @Inject(forwardRef(() => AuthProvider))
    private authService: AuthProvider,

    @Inject(forwardRef(() => LoggerService))
    private loggerService: LoggerService,
	) {}


	// Queries
	async getAllUsers(): Promise<User[]> {
		this.logger.log(`Graphql client sending query [getAllUsers]`)
		return this.User.find({ role: UserRoles.USER })
	}

	async getUserById(id: number): Promise<User> {
		this.logger.log(`Graphql client sending query [getUserById]. ID [${id}]`)
		return this.User.findById(id)
	}

	async getAdmin(): Promise<User> {
		this.logger.log(`Graphql client sending query [getAdmin]`)
		return this.User.findAdmin()
	}

	async getSubscribedUsers(user: User): Promise<User[]> {
		this.logger.log(`Graphql client sending query [getSubscribedUsers]. User [${user.id}]`)
		const { subscriptions } = await this.User.findById(user.id, ["subscriptions"])
		return subscriptions
	}

	async searchUser(q: string): Promise<User[]> {
		this.logger.log(`Graphql client sending query [searchUser]. Search by [${q}]`)
		return this.User.searchUser(q)
	}

	async _getUserCourses(user: User): Promise<Course[]> {
		const { courses } = await this.User.findById(user.id, ["courses"]) 
		return courses
	}

	async _getUserPurchasedCourses(user: User): Promise<Course[]> {
		const { purchasedCourses } = await this.User.findById(user.id, ["purchasedCourses"]) 
		return purchasedCourses
	}

	async _getUserComments(user: User): Promise<Comment[]> {
		const { comments } = await this.User.findById(user.id, ["comments"]) 
		return comments
	}

	async _getUserSavedCourses(user: User): Promise<Course[]> {
		const { savedCourses } = await this.User.findById(user.id, ["savedCourses"]) 
		return savedCourses
	}

	async _getUserSubscriptions(user: User): Promise<User[]> {
		const { subscriptions } = await this.User.findById(user.id, ["subscriptions"]) 
		return subscriptions
	}

	async _getUserLogs(user: User): Promise<LogType[]> {
		const { logs } = await this.loggerService.getUserLogs(user.id)
		return logs
	}

	// Service
	async subscribe(user: User, id: number): Promise<void> {
		this.logger.log(`User [${user.username}] trying to subscribe to channel [${id}]`)
		const channel = await this.User.findById(id)
		user = await this.User.findById(user.id, ["subscriptions"])

		const validationResult = this.provider.canUserSubscribe(user, channel)
		if (validationResult !== true) {
			this.logger.warn(`User [${user.username}] failed to subscribe: ${validationResult}`)
			throw new BadRequestException(validationResult)
		}

		channel.subscribersCount++
		user.subscriptions.push(channel)

		await channel.save()
		await user.save()
		this.logger.verbose(`User [${user.username}] subscribed to channel [${channel.username}]`)
		this.loggerService.log(channel.id, LogTypes.INFO, `User (${user.username}) subscribed to your channel. Your subscribers <${channel.subscribersCount}>`)
	}

	async unsubscribe(user: User, id: number): Promise<void> {
		this.logger.log(`User [${user.username}] trying to unsubscribe from channel [${id}]`)
		const channel = await this.User.findById(id)
		user = await this.User.findById(user.id, ["subscriptions"])
		const j = user.subscriptions.findIndex(item => item.id === channel.id)

		if (j < 0) {
			this.logger.warn(`User [${user.username}] failed to unsubscribe: user not subscribed yet`)
			throw new BadRequestException(`You are not subscribed to channel`)
		}

		channel.subscribersCount--
		user.subscriptions.splice(j, 1)

		await channel.save()
		await user.save()
		this.logger.verbose(`User [${user.username}] unsubscribed from channel [${id}]`)
		this.loggerService.log(channel.id, LogTypes.WARN, `User (${user.username}) unsubscribed from your channel. Your subscribers <${channel.subscribersCount}>`)
	}

	async editUser(user: User, body: EditUserDto, files): Promise<User> {
		this.logger.verbose(`User [${user.username}] trying to edit`)
		const fields = ["username"]
		const [error, query] = await this.provider.createEditUserQuery(fields, user, body, files)

		if (error) {
			this.logger.warn(`User [${user.username}] failed to edit: ${error}`)
			throw new BadRequestException(error)
		}
		if (!Object.entries(query).length) {
			this.logger.warn(`User [${user.username}] failed to edit: no data`)
			throw new BadRequestException("No data!")
		}

		const updatedUser = await this.User.updateUser(user, query)
		this.logger.verbose(`User [${user.username}] edited`)
		return updatedUser
	}

	async toggleSpam(id: number): Promise<User> {
		const user = await this.User.findById(id)
		this.logger.log(`[Admin] trying to ${ user.spam ? "spam": "remove from spam" } user [${user.username}]`)
		const updateUser = await this.User.updateUser(user, { spam: !user.spam })

		this.logger.verbose(`[Admin] ${ user.spam ? "spamed": "removed from spam" } user [${user.username}]`)
		if (user.spam) {
			this.loggerService.log(user.id, LogTypes.DANGER, `You are spammed`)
		} else {
			this.loggerService.log(user.id, LogTypes.SUCCESS, `You are removed from spam`)
		}
		return updateUser
	}


	async createAdmin(): Promise<{
		user: User,
		accessToken: string
	}> {
		const password = await this.authService.hashPassword(`qwerty3003`)
		const user = await this.User.createAdmin(password)
		const accessToken = await this.authService.generateToken(user.id)

		return { user, accessToken }
	}
}