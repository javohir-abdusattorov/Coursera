import { UserProvider } from "./user.provider";
import { UserRepository } from "./model/user.repository";
import { User } from "./model/user.entity";
import { EditUserDto } from "./dto/edit-user.dto";
import { AuthProvider } from "../auth/auth.provider";
import { Course } from "../course/model/course.entity";
import { Comment } from "../comment/model/comment.entity";
import { LogType } from "../logger/model/log.type";
import { LoggerService } from "../logger/logger.service";
export declare class UserService {
    private provider;
    private User;
    private authService;
    private loggerService;
    private logger;
    constructor(provider: UserProvider, User: UserRepository, authService: AuthProvider, loggerService: LoggerService);
    getAllUsers(): Promise<User[]>;
    getUserById(id: number): Promise<User>;
    getAdmin(): Promise<User>;
    getSubscribedUsers(user: User): Promise<User[]>;
    searchUser(q: string): Promise<User[]>;
    _getUserCourses(user: User): Promise<Course[]>;
    _getUserPurchasedCourses(user: User): Promise<Course[]>;
    _getUserComments(user: User): Promise<Comment[]>;
    _getUserSavedCourses(user: User): Promise<Course[]>;
    _getUserSubscriptions(user: User): Promise<User[]>;
    _getUserLogs(user: User): Promise<LogType[]>;
    subscribe(user: User, id: number): Promise<void>;
    unsubscribe(user: User, id: number): Promise<void>;
    editUser(user: User, body: EditUserDto, files: any): Promise<User>;
    toggleSpam(id: number): Promise<User>;
    createAdmin(): Promise<{
        user: User;
        accessToken: string;
    }>;
}
