import { UserRepository } from "./model/user.repository";
import { User } from "./model/user.entity";
import { Course } from "../course/model/course.entity";
import { EditUserDto } from "./dto/edit-user.dto";
import { AuthProvider } from "../auth/auth.provider";
import { FileService } from "../services/file.service";
export declare class UserProvider {
    private User;
    private authService;
    private fileService;
    private logger;
    constructor(User: UserRepository, authService: AuthProvider, fileService: FileService);
    createEditUserQuery(fields: string[], user: User, body: EditUserDto, files: any): Promise<any[]>;
    canUserSubscribe(user: User, channel: User): string | boolean;
    buyCourse(buyer: User, seller: User, price: {
        buyer: number;
        seller: number;
        admin: number;
    }, course: Course): Promise<User>;
    returnCourse(buyer: User, seller: User, price: {
        buyer: number;
        seller: number;
        admin: number;
    }, course: Course): Promise<User>;
}
