import { AuthService } from "./auth.service";
import { User } from "../user/model/user.entity";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
export declare class AuthController {
    private service;
    constructor(service: AuthService);
    register(body: RegisterDto): Promise<{
        user: User;
        token: string;
    }>;
    login(body: LoginDto): Promise<{
        role: string;
        user: User;
        token: string;
    }>;
}
