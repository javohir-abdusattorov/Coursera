import { User } from "./model/user.entity";
import { UserService } from "./user.service";
import { AuthProvider } from "../auth/auth.provider";
import { Course } from "../course/model/course.entity";
import { Comment } from "../comment/model/comment.entity";
import { LogType } from "../logger/model/log.type";
export declare class UserResolver {
    private service;
    private authService;
    constructor(service: UserService, authService: AuthProvider);
    getAllUsers(): Promise<User[]>;
    getUser(id: number): Promise<User>;
    getAdmin(): Promise<User>;
    getMe(token: string): Promise<User>;
    getSubscribedUsers(token: string): Promise<User[]>;
    searchUser(q: string): Promise<User[]>;
    courses(user: User): Promise<Course[]>;
    purchasedCourses(user: User): Promise<Course[]>;
    comments(user: User): Promise<Comment[]>;
    savedCourses(user: User): Promise<Course[]>;
    subscriptions(user: User): Promise<User[]>;
    logs(user: User): Promise<LogType[]>;
}
