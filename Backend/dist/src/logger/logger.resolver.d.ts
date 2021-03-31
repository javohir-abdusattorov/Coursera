import { LoggerService } from "./logger.service";
import { Logger } from "./model/logger.entity";
import { AuthProvider } from "../auth/auth.provider";
import { User } from "../user/model/user.entity";
export declare class LoggerResolver {
    private service;
    private authService;
    constructor(service: LoggerService, authService: AuthProvider);
    getMyLogs(token: string): Promise<Logger>;
    getUserLogs(id: number): Promise<Logger>;
    user(logger: Logger): User;
}
