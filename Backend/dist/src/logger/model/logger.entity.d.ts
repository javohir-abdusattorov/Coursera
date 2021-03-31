import * as Orm from "typeorm";
import { LogType } from "./log.type";
import { User } from "../../user/model/user.entity";
export declare class Logger extends Orm.BaseEntity {
    readonly id: number;
    logs: LogType[];
    createdAt: Date;
    updatedAt: Date;
    user: User;
}
