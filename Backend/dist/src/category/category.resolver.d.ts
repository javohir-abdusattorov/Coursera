import { CategoryService } from "./category.service";
import { Category } from "./model/category.entity";
import { AuthProvider } from "../auth/auth.provider";
import { Course } from "../course/model/course.entity";
export declare class CategoryResolver {
    private service;
    private authService;
    constructor(service: CategoryService, authService: AuthProvider);
    getAllCategories(): Promise<Category[]>;
    getCategory(id: number): Promise<Category>;
    searchCategory(q: string): Promise<Category[]>;
    courses(category: Category): Promise<Course[]>;
}
