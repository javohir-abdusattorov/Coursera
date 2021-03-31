
import { ObjectType, Field, ID } from "@nestjs/graphql"

import { CourseType } from "../../course/model/course.type"
import { UserType } from "../../user/model/user.type"


@ObjectType("Comment")
export class CommentType {
	@Field((type) => ID) readonly id: number

	@Field() message: string

	@Field() createdAt: Date

	@Field() updatedAt: Date

	@Field(type => UserType) user: UserType

	@Field(type => CourseType) course: CourseType
}