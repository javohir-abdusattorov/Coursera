import { Repository } from "typeorm";
import { Comment } from "./comment.entity";
import { CreateCommentDto } from "../dto/create-comment.dto";
import { User } from "../../user/model/user.entity";
import { Course } from "../../course/model/course.entity";
export declare class CommentRepository extends Repository<Comment> {
    private logger;
    findById(id: number, relations?: string[]): Promise<Comment>;
    createComment(body: CreateCommentDto, user: User, course: Course): Promise<Comment>;
    updateComment(comment: Comment, body: Object): Promise<Comment>;
}
