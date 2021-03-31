import { CategoryService } from "./category.service";
import { Category } from "./model/category.entity";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { EditCategoryDto } from "./dto/edit-category.dto";
export declare class CategoryController {
    private service;
    constructor(service: CategoryService);
    createCategory(body: CreateCategoryDto): Promise<Category>;
    editCategory(id: number, body: EditCategoryDto): Promise<Category>;
}
