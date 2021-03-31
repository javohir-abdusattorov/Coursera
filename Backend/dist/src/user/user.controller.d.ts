import { UserService } from "./user.service";
import { User } from "./model/user.entity";
import { EditUserDto } from "./dto/edit-user.dto";
export declare class UserController {
    private service;
    constructor(service: UserService);
    subscribe(user: User, id: number): Promise<void>;
    unsubscribe(user: User, id: number): Promise<void>;
    editUser(req: any, user: User, body: EditUserDto): Promise<User>;
    toggleSaved(id: number): Promise<User>;
    createAdmin(): Promise<{
        user: User;
        accessToken: string;
    }>;
}
