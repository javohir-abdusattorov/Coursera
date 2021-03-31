
import { ObjectType, Field, ID } from "@nestjs/graphql"

import { UserRoles } from "../enum/user-roles.enum"
import { CourseType } from "../../course/model/course.type"
import { CommentType } from "../../comment/model/comment.type"
import { LogType } from "../../logger/model/log.type"


@ObjectType("User")
export class UserType {
	@Field((type) => ID) readonly id: number

	@Field() username: string

	@Field() account: number

	@Field() profilePicture: string

	@Field() spam: boolean

	@Field() subscribersCount: number

	@Field() createdAt: Date

	@Field() updatedAt: Date

	@Field(type => String) role: UserRoles

	@Field(type => [CourseType]) courses: CourseType[]

	@Field(type => [CommentType]) comments: CommentType[]

	@Field(type => [CourseType]) purchasedCourses: CourseType[]

	@Field(type => [CourseType]) savedCourses: CourseType[]

	@Field(type => [UserType]) subscriptions: UserType[]

	@Field(type => [LogType]) logs: LogType[]
}