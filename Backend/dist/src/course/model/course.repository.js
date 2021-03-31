"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const course_entity_1 = require("./course.entity");
let CourseRepository = class CourseRepository extends typeorm_1.Repository {
    constructor() {
        super(...arguments);
        this.logger = new common_1.Logger(`CourseRoutes`);
    }
    async findById(id, relations = []) {
        const course = await this.findOne({ where: { id }, relations });
        if (!course) {
            this.logger.warn(`Course not found. ID [${id}]`);
            throw new common_1.NotFoundException(`Course not found with id "${id}"`);
        }
        return course;
    }
    async searchCourse(q) {
        const query = this.createQueryBuilder("course");
        query.where(`(course.title LIKE :search OR course.description LIKE :search)`, { search: `%${q}%` });
        return query.getMany();
    }
    async searchByTags(tags) {
        const query = this.createQueryBuilder("course");
        query.where(`course.tags @> ARRAY[:...tags]`, { tags });
        return query.getMany();
    }
    async createCourse(body) {
        this.logger.log(`User creating. Title [${body.title}]`);
        const newCourse = new course_entity_1.Course();
        for (const [key, value] of Object.entries(body))
            newCourse[key] = value;
        try {
            await newCourse.save();
        }
        catch (err) {
            this.logger.warn(`Failed to create course`, err);
            throw new common_1.BadRequestException("Invalid data!");
        }
        return newCourse;
    }
    async updateCourse(course, body) {
        for (const [key, value] of Object.entries(body))
            course[key] = value;
        try {
            await course.save();
        }
        catch (err) {
            this.logger.warn(`Failed to update course [${course.id}]`, err);
            throw new common_1.BadRequestException("Invalid data!");
        }
        return course;
    }
};
CourseRepository = __decorate([
    typeorm_1.EntityRepository(course_entity_1.Course)
], CourseRepository);
exports.CourseRepository = CourseRepository;
//# sourceMappingURL=course.repository.js.map