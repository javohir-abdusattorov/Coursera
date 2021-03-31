import { Repository } from "typeorm";
import { Logger } from "./logger.entity";
import { User } from "../../user/model/user.entity";
export declare class LoggerRepository extends Repository<Logger> {
    createLogger(user: User): Logger;
}
