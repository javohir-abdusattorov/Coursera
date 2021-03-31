import { CourseService } from "./course.service";
import { Course } from "./model/course.entity";
import { AuthProvider } from "../auth/auth.provider";
import { User } from "../user/model/user.entity";
import { Category } from "../category/model/category.entity";
import { Comment } from "../comment/model/comment.entity";
export declare class CourseResolver {
    private service;
    private authService;
    constructor(service: CourseService, authService: AuthProvider);
    getAllCourses(): Promise<Course[]>;
    getCourse(id: number): Promise<Course>;
    searchCourse(q: string): Promise<Course[]>;
    getMyCourses(token: string): Promise<Course[]>;
    getAuthorCourses(author: number): Promise<Course[]>;
    getCategoryCourses(category: number): Promise<Course[]>;
    getDiscountCourses(): Promise<Course[]>;
    getSavedCourses(): Promise<Course[]>;
    getCoursesByTags(tags: String[]): Promise<Course[]>;
    getFavouriteCourses(token: string): Promise<Course[]>;
    author(course: Course): Promise<User>;
    category(course: Course): Promise<Category>;
    comments(course: Course): Promise<Comment[]>;
    customers(course: Course): Promise<User[]>;
}
