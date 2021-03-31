"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const category_repository_1 = require("./model/category.repository");
let CategoryService = class CategoryService {
    constructor(Category) {
        this.Category = Category;
        this.logger = new common_1.Logger(`App:Category`);
    }
    async getAllCategories() {
        this.logger.log(`Graphql client sending query [getAllCategories]`);
        return this.Category.find();
    }
    async getCategory(id) {
        this.logger.log(`Graphql client sending query [getCategory]. ID [${id}]`);
        const category = await this.Category.findById(id);
        return category;
    }
    async searchCategory(q) {
        this.logger.log(`Graphql client sending query [searchCategory]. Search by [${q}]`);
        return this.Category.searchCategory(q);
    }
    async _getCategoryCourses(category) {
        const { courses } = await this.Category.findById(category.id, ["courses"]);
        return courses;
    }
    async createCategory(body) {
        return this.Category.createCategory(body);
    }
    async editCategory(id, body) {
        this.logger.log(`[Admin] trying to edit category [${id}]`);
        const category = await this.Category.findById(id);
        const keys = ["name"];
        const obj = {};
        for (const key of keys)
            if (body[key])
                obj[key] = body[key];
        if (!Object.entries(obj).length)
            throw new common_1.BadRequestException("No data!");
        const updatedCategory = await this.Category.updateCategory(category, obj);
        this.logger.log(`[Admin] edited category [${id}]`);
        return updatedCategory;
    }
};
CategoryService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(category_repository_1.CategoryRepository)),
    __metadata("design:paramtypes", [category_repository_1.CategoryRepository])
], CategoryService);
exports.CategoryService = CategoryService;
//# sourceMappingURL=category.service.js.map