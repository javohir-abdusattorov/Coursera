import { CourseType } from "../../course/model/course.type";
import { UserType } from "../../user/model/user.type";
export declare class CommentType {
    readonly id: number;
    message: string;
    createdAt: Date;
    updatedAt: Date;
    user: UserType;
    course: CourseType;
}
