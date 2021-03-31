import { Repository } from "typeorm";
import { Course } from "./course.entity";
import { User } from "../../user/model/user.entity";
import { Category } from "../../category/model/category.entity";
export declare class CourseRepository extends Repository<Course> {
    private logger;
    findById(id: number, relations?: string[]): Promise<Course>;
    searchCourse(q: string): Promise<Course[]>;
    searchByTags(tags: String[]): Promise<Course[]>;
    createCourse(body: {
        title: string;
        description: string;
        price: number;
        video: string;
        poster: string;
        tags: string[];
        author: User;
        category: Category;
    }): Promise<Course>;
    updateCourse(course: Course, body: Object): Promise<Course>;
}
