
import * as bcrypt from "bcrypt"
import { Injectable, Logger, Inject, forwardRef, BadRequestException } from '@nestjs/common'
import { InjectRepository } from "@nestjs/typeorm"
import { JwtService } from "@nestjs/jwt"

import { User } from "../user/model/user.entity"
import { AuthProvider } from "./auth.provider"
import { JwtPayload } from "./jwt/jwt-payload.interface"
import { RegisterDto } from "./dto/register.dto"
import { LoginDto } from "./dto/login.dto"

import { UserRepository } from "../user/model/user.repository"
import { UserService } from "../user/user.service"
import { LoggerService } from "../logger/logger.service"


@Injectable()
export class AuthService {
	private logger = new Logger("App:Auth")

	constructor (
		@InjectRepository(UserRepository)
		private User: UserRepository,
		private jwtService: JwtService,
		private provider: AuthProvider,

    @Inject(forwardRef(() => LoggerService))
    private loggerService: LoggerService,
	) {}


	async register(body: RegisterDto): Promise<{
		user: User,
		token: string
	}> {
		this.logger.log(`Guest [${body.username}] trying to register`)
		const password = await this.provider.hashPassword(body.password)
		const user = await this.User.createUser(body.username, password)
		const token = await this.provider.generateToken(user.id)

		this.logger.verbose(`User registred. ID [${user.id}]`)
		await this.loggerService.initilizeLogger(user)
		return { user, token }
	}

	async login(body: RegisterDto): Promise<{
		role: string,
		user: User,
		token: string
	}> {
		const { username, password } = body
		this.logger.log(`Guest [${username}] trying to login`)
		const user = await this.User.findUser(username)

		const isCorrectPassword = await this.provider.checkPassword(password, user.password)
		if (!isCorrectPassword) {
			this.logger.warn(`Guest [${username}] failed to login: incorrect password`)
			throw new BadRequestException(`Invalid password`)
		}

		const token = await this.provider.generateToken(user.id)
		this.logger.verbose(`Guest [${username}] logged in. ID [${user.id}]`)

		return {
			role: user.role,
			user,
			token
		}
	}
}
