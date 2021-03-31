import { CourseService } from "./course.service";
import { Course } from "./model/course.entity";
import { CreateCourseDto } from "./dto/create-course.dto";
import { EditCourseDto } from "./dto/edit-course.dto";
import { User } from "../user/model/user.entity";
export declare class CourseController {
    private service;
    constructor(service: CourseService);
    createCourse(req: any, user: User, body: CreateCourseDto): Promise<Course>;
    editCourse(req: any, user: User, id: number, body: EditCourseDto): Promise<Course>;
    deleteCourse(user: User, id: number): Promise<void>;
    addCourseToSaved(user: User, id: number): Promise<void>;
    removeCourseFromSaved(user: User, id: number): Promise<void>;
    canBuyCourse(id: number, user: User): Promise<{
        canBuy: boolean;
        discount: boolean;
        spam: boolean;
        price: number;
        discountPrice: number;
        spamPrice: number;
        total: number;
    }>;
    canReturnCourse(id: number, user: User): Promise<{
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
    clearDB(): Promise<void>;
}
