"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const category_entity_1 = require("./category.entity");
let CategoryRepository = class CategoryRepository extends typeorm_1.Repository {
    constructor() {
        super(...arguments);
        this.logger = new common_1.Logger(`App:Category`);
    }
    async findById(id, relations = []) {
        const category = await this.findOne({ where: { id }, relations });
        if (!category) {
            this.logger.warn(`Category not found. ID [${id}]`);
            throw new common_1.NotFoundException(`Category not found with id "${id}"`);
        }
        return category;
    }
    async searchCategory(q) {
        const query = this.createQueryBuilder("category");
        query.where(`(category.name LIKE :search)`, { search: `%${q}%` });
        return query.getMany();
    }
    async createCategory(body) {
        const { name } = body;
        this.logger.log(`[Admin] trying to create category. Name [${name}]`);
        const newCategory = new category_entity_1.Category();
        newCategory.name = name;
        try {
            await newCategory.save();
        }
        catch (err) {
            if (err.code === "23505") {
                this.logger.warn(`[Admin] failed to create category: name conflict`);
                throw new common_1.ConflictException(`Category with name "${name}" already exists. Try another one`);
            }
            else {
                this.logger.warn(`[Admin] failed to create category`, err);
                throw new common_1.BadRequestException("Invalid data!");
            }
        }
        return newCategory;
    }
    async updateCategory(category, body) {
        for (const [key, value] of Object.entries(body))
            category[key] = value;
        try {
            await category.save();
        }
        catch (err) {
            this.logger.warn(`[Admin] failed to edit category`, err);
            throw new common_1.BadRequestException("Invalid data!");
        }
        return category;
    }
};
CategoryRepository = __decorate([
    typeorm_1.EntityRepository(category_entity_1.Category)
], CategoryRepository);
exports.CategoryRepository = CategoryRepository;
//# sourceMappingURL=category.repository.js.map