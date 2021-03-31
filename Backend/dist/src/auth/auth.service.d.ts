import { JwtService } from "@nestjs/jwt";
import { User } from "../user/model/user.entity";
import { AuthProvider } from "./auth.provider";
import { RegisterDto } from "./dto/register.dto";
import { UserRepository } from "../user/model/user.repository";
import { LoggerService } from "../logger/logger.service";
export declare class AuthService {
    private User;
    private jwtService;
    private provider;
    private loggerService;
    private logger;
    constructor(User: UserRepository, jwtService: JwtService, provider: AuthProvider, loggerService: LoggerService);
    register(body: RegisterDto): Promise<{
        user: User;
        token: string;
    }>;
    login(body: RegisterDto): Promise<{
        role: string;
        user: User;
        token: string;
    }>;
}
