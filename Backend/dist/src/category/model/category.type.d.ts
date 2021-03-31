import { CourseType } from "../../course/model/course.type";
export declare class CategoryType {
    readonly id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    courses: CourseType[];
}
