import { Course } from "./model/course.entity";
import { CourseRepository } from "./model/course.repository";
import { EditCourseDto } from "./dto/edit-course.dto";
import { FileService } from "../services/file.service";
import { CategoryRepository } from "../category/model/category.repository";
import { User } from "../user/model/user.entity";
import { LoggerService } from "../logger/logger.service";
export declare class CourseProvider {
    private Course;
    private Category;
    private fileService;
    private loggerService;
    private logger;
    constructor(Course: CourseRepository, Category: CategoryRepository, fileService: FileService, loggerService: LoggerService);
    getAllDiscountedCourses(): Promise<Course[]>;
    createEditCourseQuery(course: Course, keys: string[], body: EditCourseDto, files: any): Promise<any[]>;
    canUserBuyCourse(user: User, course: Course): string | boolean;
    canUserReturnCourse(user: User, course: Course, price: number): string | boolean;
    canUserAddCourseToSaved(user: User, course: Course): string | boolean;
    userBuyedCourse(course: Course, user: User): Promise<void>;
    userReturnedCourse(course: Course, user: User): Promise<void>;
    calculateCoursePrice(course: Course, isSpam: boolean): {
        buyer: number;
        seller: number;
        admin: number;
    };
    calculateCourseReturnPrice(course: Course, isSpam: boolean): {
        buyer: number;
        seller: number;
        admin: number;
    };
    calculateCoursePriceForBuyer(course: Course, buyerAccount: number, isSpam: boolean): {
        canBuy: boolean;
        discount: boolean;
        spam: boolean;
        price: number;
        discountPrice: number;
        spamPrice: number;
        total: number;
    };
    calculateCourseReturnPriceForBuyer(course: Course, authorAccount: number, isSpam: boolean): {
        canReturn: boolean;
        spam: boolean;
        price: number;
        spamPrice: number;
        total: number;
    };
    calculateCourseRating(course: Course, rate: number): number;
    endCoursesDiscount(date: Date): Promise<void>;
    removeCourseDiscount(course: Course): Promise<void>;
    deleteCourse(course: Course): Promise<void>;
    round(value: number, precision?: number): number;
}
