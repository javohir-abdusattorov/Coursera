
import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from "@nestjs/typeorm"

import { LoggerService } from './logger.service'
import { LoggerResolver } from "./logger.resolver"
import { LoggerRepository } from "./model/logger.repository"
import { AuthModule } from "../auth/auth.module"


@Module({
	imports: [
		forwardRef(() => AuthModule),
		TypeOrmModule.forFeature([ LoggerRepository ]),
	],
  controllers: [],
  providers: [LoggerService, LoggerResolver],
  exports: [LoggerService]
})
export class LoggerModule {}
