import { LogType } from "./log.type";
import { UserType } from "../../user/model/user.type";
export declare class LoggerType {
    readonly id: number;
    logs: LogType[];
    createdAt: Date;
    updatedAt: Date;
    user: UserType;
}
