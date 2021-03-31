
import * as validator from "class-validator"


export class RegisterDto {
	@validator.IsNotEmpty()
	@validator.IsString()
	@validator.MinLength(4)
	@validator.MaxLength(20)
	username: string

	@validator.IsNotEmpty()
	@validator.MinLength(6)
	@validator.Matches(/^.*(?=.{6,})(?=.*[a-zA-Z])(?=.*\d).*$/, {
		message: "Password must contain at least 2 letters and at least 2 numbers"
	})
	password: string
}