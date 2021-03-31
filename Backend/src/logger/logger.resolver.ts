
import { Injectable, Inject, forwardRef, NotFoundException, BadRequestException } from '@nestjs/common'
import { Resolver, ResolveField, Query, Mutation, Args, Parent } from "@nestjs/graphql"

import { LoggerService } from "./logger.service"
import { Logger } from "./model/logger.entity"
import { LoggerType } from "./model/logger.type"
import { AuthProvider } from "../auth/auth.provider"
import { User } from "../user/model/user.entity"


@Resolver(of => LoggerType)
export class LoggerResolver {
	constructor(
		private service: LoggerService,

    @Inject(forwardRef(() => AuthProvider))
    private authService: AuthProvider,
	) {}


	@Query(() => LoggerType)
	async getMyLogs(
		@Args("token") token: string
	) {
		const user = await this.authService.authorizeByToken(token)
		return this.service.getUserLogs(user.id)
	}

	@Query(() => LoggerType)
	async getUserLogs(
		@Args("id") id: number
	) {
		return this.service.getUserLogs(id)
	}


	// Sub-fields: user
	@ResolveField()
	user(@Parent() logger: Logger): User {
		return logger.user
	}
}