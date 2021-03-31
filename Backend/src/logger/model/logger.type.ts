
import { ObjectType, Field, ID } from "@nestjs/graphql"

import { LogType } from "./log.type"
import { UserType } from "../../user/model/user.type"


@ObjectType("Logger")
export class LoggerType {
	@Field((type) => ID) readonly id: number

	@Field(type => [LogType]) logs: LogType[]

	@Field() createdAt: Date

	@Field() updatedAt: Date

	@Field(type => UserType) user: UserType
}