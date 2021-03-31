import { LoggerRepository } from "./model/logger.repository";
import { Logger } from "./model/logger.entity";
import { User } from "../user/model/user.entity";
import { LogTypes } from "./enum/log-type.enum";
export declare class LoggerService {
    private Logger;
    constructor(Logger: LoggerRepository);
    getUserLogs(id: number): Promise<Logger>;
    initilizeLogger(user: User): Promise<void>;
    log(id: number, type: LogTypes, message: string): Promise<void>;
}
