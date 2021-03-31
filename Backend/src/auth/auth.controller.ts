
import {
	Controller, Req, Res,
	Get, Post, Patch, Delete,
	Body, Param, Query,
	UsePipes, UseGuards, ValidationPipe, ParseIntPipe
} from '@nestjs/common'

import { AuthService } from "./auth.service"
import { User } from "../user/model/user.entity"
import { RegisterDto } from "./dto/register.dto"
import { LoginDto } from "./dto/login.dto"


@Controller("api/auth")
export class AuthController {
	constructor(private service: AuthService) {}


	@Post("/register")
	@UsePipes(ValidationPipe)
	register(@Body() body: RegisterDto): Promise<{
		user: User,
		token: string
	}> {
		return this.service.register(body)
	}

	@Post("/login")
	@UsePipes(ValidationPipe)
	login(@Body() body: LoginDto): Promise<{
		role: string,
		user: User,
		token: string
	}> {
		return this.service.login(body)
	}
	
}