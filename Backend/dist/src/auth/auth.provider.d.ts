import { JwtService } from "@nestjs/jwt";
import { User } from "../user/model/user.entity";
import { UserRepository } from "../user/model/user.repository";
export declare class AuthProvider {
    private User;
    private jwtService;
    private logger;
    constructor(User: UserRepository, jwtService: JwtService);
    authorizeByToken(token: string): Promise<User>;
    checkPassword(password: any, realPassword: any): Promise<boolean>;
    hashPassword(password: string): Promise<string>;
    generateToken(id: any): Promise<string>;
}
