import * as Orm from "typeorm";
import { Course } from "../../course/model/course.entity";
import { Comment } from "../../comment/model/comment.entity";
import { UserRoles } from "../enum/user-roles.enum";
export declare class User extends Orm.BaseEntity {
    readonly id: number;
    username: string;
    password: string;
    account: number;
    profilePicture: string;
    spam: boolean;
    role: UserRoles;
    subscribersCount: number;
    createdAt: Date;
    updatedAt: Date;
    courses: Course[];
    comments: Comment[];
    purchasedCourses: Course[];
    savedCourses: Course[];
    subscriptions: User[];
}
