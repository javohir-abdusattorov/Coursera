import { CommentService } from "./comment.service";
import { Comment } from "./model/comment.entity";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { EditCommentDto } from "./dto/edit-comment.dto";
import { User } from "../user/model/user.entity";
export declare class CommentController {
    private service;
    constructor(service: CommentService);
    postComment(id: number, user: User, body: CreateCommentDto): Promise<Comment>;
    editComment(id: number, user: User, body: EditCommentDto): Promise<Comment>;
    deleteComment(id: number, user: User): Promise<void>;
    deleteCommentByAdmin(id: number): Promise<void>;
}
