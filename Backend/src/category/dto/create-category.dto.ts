
import * as validator from "class-validator"


export class CreateCategoryDto {
	@validator.IsNotEmpty()
	@validator.IsString()
	name: string
}