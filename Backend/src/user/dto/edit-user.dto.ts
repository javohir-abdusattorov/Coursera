
import * as validator from "class-validator"


export class EditUserDto {
	@validator.IsOptional()
	@validator.IsString()
	@validator.Length(4, 20)
	username: string

	@validator.IsOptional()
	@validator.MinLength(6)
	@validator.Matches(/^.*(?=.{6,})(?=.*[a-zA-Z])(?=.*\d).*$/, {
		message: "Password must contain at least 2 letters and at least 2 numbers"
	})
	oldPassword: string

	@validator.IsOptional()
	@validator.MinLength(6)
	@validator.Matches(/^.*(?=.{6,})(?=.*[a-zA-Z])(?=.*\d).*$/, {
		message: "Password must contain at least 2 letters and at least 2 numbers"
	})
	newPassword: string
}