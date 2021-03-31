import * as Orm from "typeorm";
import { Course } from "../../course/model/course.entity";
export declare class Category extends Orm.BaseEntity {
    readonly id: number;
    name: string;
    courses: Course[];
    createdAt: Date;
    updatedAt: Date;
}
