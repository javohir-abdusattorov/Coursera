import { CommentService } from "./comment.service";
import { Comment } from "./model/comment.entity";
import { AuthProvider } from "../auth/auth.provider";
import { User } from "../user/model/user.entity";
import { Course } from "../course/model/course.entity";
export declare class CommentResolver {
    private service;
    private authService;
    constructor(service: CommentService, authService: AuthProvider);
    getAllComments(): any;
    getComment(id: number): any;
    user(comment: Comment): Promise<User>;
    course(comment: Comment): Promise<Course>;
}
