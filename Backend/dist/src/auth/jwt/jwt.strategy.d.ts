import { User } from "../../user/model/user.entity";
import { UserRepository } from "../../user/model/user.repository";
import { JwtPayload } from "./jwt-payload.interface";
declare const JwtStrategy_base: new (...args: any[]) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private Model;
    constructor(Model: UserRepository);
    validate(payload: JwtPayload): Promise<User>;
}
export {};
