import { UserRoles } from "../enum/user-roles.enum";
import { CourseType } from "../../course/model/course.type";
import { CommentType } from "../../comment/model/comment.type";
import { LogType } from "../../logger/model/log.type";
export declare class UserType {
    readonly id: number;
    username: string;
    account: number;
    profilePicture: string;
    spam: boolean;
    subscribersCount: number;
    createdAt: Date;
    updatedAt: Date;
    role: UserRoles;
    courses: CourseType[];
    comments: CommentType[];
    purchasedCourses: CourseType[];
    savedCourses: CourseType[];
    subscriptions: UserType[];
    logs: LogType[];
}
