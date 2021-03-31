
import { ObjectType, Field, ID } from "@nestjs/graphql"
import { LogTypes } from "../enum/log-type.enum"


@ObjectType("Log")
export class LogType {
	@Field() type: LogTypes

	@Field() message: string

	@Field() createdAt: number
}