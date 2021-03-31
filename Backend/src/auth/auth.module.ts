
import { Module } from '@nestjs/common'
import { TypeOrmModule } from "@nestjs/typeorm"
import { JwtModule } from "@nestjs/jwt"
import { PassportModule } from "@nestjs/passport"

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { AuthProvider } from "./auth.provider"
import { JwtStrategy } from "./jwt/jwt.strategy"
import { JwtOptions } from "./jwt/jwt.config"

import { UserRepository } from "../user/model/user.repository"
import { UserModule } from "../user/user.module"
import { LoggerModule } from "../logger/logger.module"


@Module({
	imports: [
    LoggerModule,
		PassportModule.register({ defaultStrategy: "jwt" }),
		JwtModule.register(JwtOptions),
		TypeOrmModule.forFeature([ UserRepository ]),
	],
  controllers: [AuthController],
  providers: [
  	AuthService,
    AuthProvider,
  	JwtStrategy,
  ],
  exports: [
    AuthProvider,
  	JwtStrategy,
  	PassportModule,
  ]
})
export class AuthModule {}
