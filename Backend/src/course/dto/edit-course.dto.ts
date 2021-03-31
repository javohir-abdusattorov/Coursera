
import * as validator from "class-validator"


export class EditCourseDto {
	@validator.IsOptional()
	@validator.IsNotEmpty()
	@validator.IsString()
	title: string

	@validator.IsOptional()
	@validator.IsNotEmpty()
	@validator.IsString()
	description: string

	@validator.IsOptional()
	@validator.IsNumber()
	@validator.IsPositive()
	price: number

	@validator.IsOptional()
	@validator.IsArray()
	@validator.ArrayNotEmpty()
	@validator.ArrayUnique()
	tags: string[]

	@validator.IsOptional()
	@validator.IsNumber()
	@validator.IsPositive()
	category: number

	@validator.IsOptional()
	@validator.IsBoolean()
	discount: boolean

	@validator.IsOptional()
	@validator.IsNumber()
	@validator.Min(1)
	@validator.Max(100)
	discountPercent: number

	@validator.IsOptional()
	@validator.IsDate()
	discountDeadline: Date
}