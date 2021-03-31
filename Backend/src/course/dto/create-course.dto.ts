
import * as validator from "class-validator"


export class CreateCourseDto {
	@validator.IsNotEmpty()
	@validator.IsString()
	title: string

	@validator.IsNotEmpty()
	@validator.IsString()
	description: string

	@validator.IsNumber()
	@validator.IsPositive()
	price: string

	@validator.IsArray()
	@validator.ArrayNotEmpty()
	@validator.ArrayUnique()
	tags: string[]

	@validator.IsNumber()
	@validator.IsPositive()
	category: string
}