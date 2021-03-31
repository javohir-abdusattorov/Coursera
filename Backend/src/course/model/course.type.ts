
import { ObjectType, Field, ID } from "@nestjs/graphql"

import { UserType } from "../../user/model/user.type"
import { CategoryType } from "../../category/model/category.type"
import { CommentType } from "../../comment/model/comment.type"


@ObjectType("Course")
export class CourseType {
	@Field((type) => ID) readonly id: number

	@Field() title: string

	@Field() description: string

	@Field() price: number

	@Field() video: string

	@Field() poster: string

	@Field() sold: number

	@Field() rating: number

	@Field() discount: boolean

	@Field() discountPercent: number

	@Field() discountDeadline: number

	@Field() active: boolean

	@Field() saved: boolean

	@Field(type => [String]) tags: string[]

	@Field() createdAt: Date

	@Field() updatedAt: Date

	@Field(type => UserType) author: UserType

	@Field(type => CategoryType) category: CategoryType

	@Field(type => [CommentType]) comments: CommentType[]

	@Field(type => [UserType]) customers: UserType[]
}