import { Repository } from "typeorm";
import { User } from "./user.entity";
export declare class UserRepository extends Repository<User> {
    private logger;
    findUser(username: string): Promise<User>;
    findById(id: number, relations?: string[]): Promise<User>;
    findAdmin(relations?: string[]): Promise<User>;
    searchUser(q: string): Promise<User[]>;
    createUser(username: string, password: string): Promise<User>;
    updateUser(user: User, body: Object): Promise<User>;
    createAdmin(password: string): Promise<User>;
}
