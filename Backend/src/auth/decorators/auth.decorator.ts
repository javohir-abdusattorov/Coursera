
import { UseGuards, SetMetadata, applyDecorators } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { RolesGuard } from "../jwt/roles.guard"


export function Auth(...roles: string[]) {
  return applyDecorators(
  	SetMetadata("roles", roles),
		UseGuards(AuthGuard(), RolesGuard)
  )
}