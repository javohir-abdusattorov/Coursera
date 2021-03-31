
import * as validator from "class-validator"


export class CreateCommentDto {
	@validator.IsNotEmpty()
	@validator.IsString()
	@validator.MaxLength(1000)
	message: string
}