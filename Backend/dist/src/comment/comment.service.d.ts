import { CommentRepository } from "./model/comment.repository";
import { Comment } from "./model/comment.entity";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { EditCommentDto } from "./dto/edit-comment.dto";
import { User } from "../user/model/user.entity";
import { Course } from "../course/model/course.entity";
import { CourseRepository } from "../course/model/course.repository";
import { LoggerService } from "../logger/logger.service";
export declare class CommentService {
    private Comment;
    private Course;
    private loggerService;
    private logger;
    constructor(Comment: CommentRepository, Course: CourseRepository, loggerService: LoggerService);
    getAllComments(): Promise<Comment[]>;
    getComment(id: number): Promise<Comment>;
    _getCommentUser(comment: Comment): Promise<User>;
    _getCommentCourse(comment: Comment): Promise<Course>;
    postComment(user: User, id: number, body: CreateCommentDto): Promise<Comment>;
    editComment(user: User, id: number, body: EditCommentDto): Promise<Comment>;
    deleteComment(user: User, id: number): Promise<void>;
    deleteCommentByAdmin(id: number): Promise<void>;
}
