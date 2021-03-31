
import { BadRequestException, NotFoundException } from "@nestjs/common"
import { EntityRepository, Repository } from "typeorm"

import { Logger } from "./logger.entity"
import { User } from "../../user/model/user.entity"


@EntityRepository(Logger)
export class LoggerRepository extends Repository<Logger> {
	createLogger(user: User): Logger {
		const newLogger = new Logger()
		newLogger.logs = []
		newLogger.user = user
		return newLogger
	}
}