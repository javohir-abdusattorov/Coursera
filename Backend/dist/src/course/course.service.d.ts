import { CourseProvider } from "./course.provider";
import { Course } from "./model/course.entity";
import { CourseRepository } from "./model/course.repository";
import { CreateCourseDto } from "./dto/create-course.dto";
import { EditCourseDto } from "./dto/edit-course.dto";
import { FileService } from "../services/file.service";
import { CategoryRepository } from "../category/model/category.repository";
import { User } from "../user/model/user.entity";
import { UserProvider } from "../user/user.provider";
import { UserRepository } from "../user/model/user.repository";
import { Category } from "../category/model/category.entity";
import { Comment } from "../comment/model/comment.entity";
import { LoggerService } from "../logger/logger.service";
export declare class CourseService {
    private provider;
    private Course;
    private Category;
    private User;
    private fileService;
    private userService;
    private loggerService;
    private logger;
    constructor(provider: CourseProvider, Course: CourseRepository, Category: CategoryRepository, User: UserRepository, fileService: FileService, userService: UserProvider, loggerService: LoggerService);
    getAllCourses(): Promise<Course[]>;
    getCourse(id: number): Promise<Course>;
    searchCourse(q: string): Promise<Course[]>;
    getMyCourses(user: User): Promise<Course[]>;
    getAuthorCourses(id: number): Promise<Course[]>;
    getCategoryCourses(id: number): Promise<Course[]>;
    getDiscountCourses(): Promise<Course[]>;
    getSavedCourses(): Promise<Course[]>;
    getCoursesByTags(tags: String[]): Promise<Course[]>;
    getFavouriteCourses(user: User): Promise<Course[]>;
    _getCourseAuthor(course: Course): Promise<User>;
    _getCourseCategory(course: Course): Promise<Category>;
    _getCourseComments(course: Course): Promise<Comment[]>;
    _getCourseCustomers(course: Course): Promise<User[]>;
    createCourse(user: User, body: CreateCourseDto, files: any): Promise<Course>;
    editCourse(user: User, id: number, body: EditCourseDto, files: any): Promise<Course>;
    addCourseToSaved(user: User, id: number): Promise<void>;
    removeCourseFromSaved(user: User, id: number): Promise<void>;
    canBuyCourse(user: User, id: number): Promise<{
        canBuy: boolean;
        discount: boolean;
        spam: boolean;
        price: number;
        discountPrice: number;
        spamPrice: number;
        total: number;
    }>;
    canReturnCourse(user: User, id: number): Promise<{
        canReturn: boolean;
        spam: boolean;
        price: number;
        spamPrice: number;
        total: number;
    }>;
    buyCourse(id: number, user: User): Promise<void>;
    returnCourse(id: number, user: User): Promise<void>;
    rateCourse(id: number, user: User, rating: number): Promise<number>;
    activateCourse(id: number): Promise<Course>;
    disableCourse(id: number): Promise<void>;
    toggleSaved(id: number): Promise<Course>;
    deleteCourse(id: number, user: User): Promise<void>;
    clearDB(): Promise<void>;
}