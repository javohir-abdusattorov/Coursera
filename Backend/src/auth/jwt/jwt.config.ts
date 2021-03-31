
import * as config from "config"
const jwtConfig = config.get("jwt")


export const JwtOptions = {
	secret: jwtConfig.secret,
	signOptions: {
		expiresIn: jwtConfig.expiresIn
	}
}