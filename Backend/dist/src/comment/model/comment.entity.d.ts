import * as Orm from "typeorm";
import { User } from "../../user/model/user.entity";
import { Course } from "../../course/model/course.entity";
export declare class Comment extends Orm.BaseEntity {
    readonly id: number;
    message: string;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    course: Course;
}
