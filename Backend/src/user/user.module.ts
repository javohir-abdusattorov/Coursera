
import { Module } from '@nestjs/common'
import { TypeOrmModule } from "@nestjs/typeorm"

import { UserController } from './user.controller'
import { UserService } from './user.service'
import { UserProvider } from "./user.provider"
import { UserResolver } from "./user.resolver"
import { UserRepository } from "./model/user.repository"

import { AuthModule } from "../auth/auth.module"
import { LoggerModule } from "../logger/logger.module"
import { ServicesModule } from "../services/services.module"


@Module({
	imports: [
		AuthModule,
		LoggerModule,
		ServicesModule,
		TypeOrmModule.forFeature([ UserRepository ]),
	],
  controllers: [UserController],
  providers: [UserResolver, UserService, UserProvider],
  exports: [UserProvider],
})
export class UserModule {}