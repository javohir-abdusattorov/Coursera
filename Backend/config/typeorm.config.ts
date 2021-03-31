
import * as path from "path"
import * as config from "config"
import { TypeOrmModuleOptions } from "@nestjs/typeorm"


const dbConfig = config.db

export const TypeOrmConfig: TypeOrmModuleOptions = {
	type: dbConfig.type,
	host: dbConfig.host,
	port: dbConfig.port,
	username: dbConfig.username,
	password: dbConfig.password,
	database: dbConfig.database,
	synchronize: dbConfig.synchronize,
	entities: [path.join(__dirname, '/../**/**.entity{.ts,.js}')],
}