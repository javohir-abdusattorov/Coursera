
import * as config from "config"
import * as bcrypt from "bcrypt"
import { verify } from "jsonwebtoken"
import { Injectable, Logger, BadRequestException, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from "@nestjs/typeorm"
import { JwtService } from "@nestjs/jwt"

import { User } from "../user/model/user.entity"
import { UserRepository } from "../user/model/user.repository"
import { JwtPayload } from "./jwt/jwt-payload.interface"
import { RegisterDto } from "./dto/register.dto"
import { LoginDto } from "./dto/login.dto"
import { UserService } from "../user/user.service"


@Injectable()
export class AuthProvider {
	private logger = new Logger("App:Auth")

	constructor (
		@InjectRepository(UserRepository)
		private User: UserRepository,
		private jwtService: JwtService,
	) {}


	async authorizeByToken(token: string): Promise<User> {
		this.logger.log(`Graphql client trying to authorize`)
		let id: number 
		try {
			const payload = verify(token, config.jwt.secret)
			id = payload["id"]
		} catch(err) {
			this.logger.warn(`Client failed to authorize: invalid token`)
			throw new UnauthorizedException("You are unauthorized")
		}

		const user = await this.User.findOne({ id })
		if (!user) {
			this.logger.warn(`Client failed to authorize: user not found`)
			throw new UnauthorizedException("You are unauthorized")
		}

		this.logger.log(`Graphql client authorized successfuly`)
		return user
	}

	async checkPassword(password, realPassword): Promise<boolean> {
		return bcrypt.compare(password, realPassword)
	}

	async hashPassword(password: string): Promise<string> {
		const salt = await bcrypt.genSalt()
		return bcrypt.hash(password, salt)
	}

	async generateToken(id): Promise<string> {
		const payload: JwtPayload = { id }
		return this.jwtService.sign(payload)
	}
}