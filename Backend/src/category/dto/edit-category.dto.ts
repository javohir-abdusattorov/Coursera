
import * as validator from "class-validator"


export class EditCategoryDto {
	@validator.IsNotEmpty()
	@validator.IsString()
	name: string
}