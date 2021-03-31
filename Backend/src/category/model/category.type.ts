
import { ObjectType, Field, ID } from "@nestjs/graphql"
import { CourseType } from "../../course/model/course.type"


@ObjectType("Category")
export class CategoryType {
	@Field((type) => ID) readonly id: number

	@Field() name: string

	@Field() createdAt: Date

	@Field() updatedAt: Date

	@Field(type => [CourseType]) courses: CourseType[]
}