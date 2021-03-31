
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from "@nestjs/typeorm"

import { LoggerRepository } from "./model/logger.repository"
import { Logger } from "./model/logger.entity"
import { User } from "../user/model/user.entity"
import { LogTypes } from "./enum/log-type.enum"


@Injectable()
export class LoggerService {

	constructor (
		@InjectRepository(LoggerRepository)
		private Logger: LoggerRepository,
	) {}


	// Queries
	async getUserLogs(id: number): Promise<Logger> {
		return this.Logger.findOne({ user: { id } })
	}

	// Service
	async initilizeLogger(user: User) {
		const newLogger = this.Logger.createLogger(user)
		newLogger.logs.push({
			type: LogTypes.SUCCESS,
			createdAt: new Date().getTime(),
			message: `You registred successfuly. Your Username: <${user.username}>, ID: <${user.id}>. Welcome to (Online Courses)`
		})
		await newLogger.save()
	}

	async log(id: number, type: LogTypes, message: string): Promise<void> {
		const logger = await this.Logger.findOne({ user: { id } })
		logger.logs.push({
			type, message,
			createdAt: new Date().getTime()
		})
		await logger.save()
	}
}