import { CategoryRepository } from "./model/category.repository";
import { Category } from "./model/category.entity";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { EditCategoryDto } from "./dto/edit-category.dto";
import { Course } from "../course/model/course.entity";
export declare class CategoryService {
    private Category;
    private logger;
    constructor(Category: CategoryRepository);
    getAllCategories(): Promise<Category[]>;
    getCategory(id: number): Promise<Category>;
    searchCategory(q: string): Promise<Category[]>;
    _getCategoryCourses(category: Category): Promise<Course[]>;
    createCategory(body: CreateCategoryDto): Promise<Category>;
    editCategory(id: number, body: EditCategoryDto): Promise<Category>;
}
