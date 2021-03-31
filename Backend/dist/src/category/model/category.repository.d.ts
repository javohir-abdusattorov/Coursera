import { Repository } from "typeorm";
import { Category } from "./category.entity";
import { CreateCategoryDto } from "../dto/create-category.dto";
export declare class CategoryRepository extends Repository<Category> {
    private logger;
    findById(id: number, relations?: string[]): Promise<Category>;
    searchCategory(q: string): Promise<Category[]>;
    createCategory(body: CreateCategoryDto): Promise<Category>;
    updateCategory(category: Category, body: Object): Promise<Category>;
}
