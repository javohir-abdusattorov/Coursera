
import * as config from "config"
import { UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from "@nestjs/passport"
import { Strategy, ExtractJwt } from "passport-jwt"
import { InjectRepository } from "@nestjs/typeorm"

import { User } from "../../user/model/user.entity"
import { UserRepository } from "../../user/model/user.repository"
import { JwtPayload } from "./jwt-payload.interface"


export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		@InjectRepository(UserRepository)
		private Model: UserRepository,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: config.get("jwt").secret
		})
	}


	async validate(payload: JwtPayload): Promise<User> {
		const { id } = payload
		const user = await this.Model.findOne({ id })

		if (!user) throw new UnauthorizedException("You are unauthorized")
		return user
	}
}