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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Course = void 0;
const Orm = require("typeorm");
const user_entity_1 = require("../../user/model/user.entity");
const comment_entity_1 = require("../../comment/model/comment.entity");
const category_entity_1 = require("../../category/model/category.entity");
let Course = class Course extends Orm.BaseEntity {
};
__decorate([
    Orm.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Course.prototype, "id", void 0);
__decorate([
    Orm.Column(),
    __metadata("design:type", String)
], Course.prototype, "title", void 0);
__decorate([
    Orm.Column(),
    __metadata("design:type", String)
], Course.prototype, "description", void 0);
__decorate([
    Orm.Column(),
    __metadata("design:type", Number)
], Course.prototype, "price", void 0);
__decorate([
    Orm.Column(),
    __metadata("design:type", String)
], Course.prototype, "video", void 0);
__decorate([
    Orm.Column(),
    __metadata("design:type", String)
], Course.prototype, "poster", void 0);
__decorate([
    Orm.Column({ default: 0 }),
    __metadata("design:type", Number)
], Course.prototype, "sold", void 0);
__decorate([
    Orm.Column({ default: 0, type: "float", scale: 1 }),
    __metadata("design:type", Number)
], Course.prototype, "rating", void 0);
__decorate([
    Orm.Column({ default: false }),
    __metadata("design:type", Boolean)
], Course.prototype, "discount", void 0);
__decorate([
    Orm.Column({ default: 0 }),
    __metadata("design:type", Number)
], Course.prototype, "discountPercent", void 0);
__decorate([
    Orm.Column({ type: "bigint", default: 0 }),
    __metadata("design:type", Number)
], Course.prototype, "discountDeadline", void 0);
__decorate([
    Orm.Column({ default: false }),
    __metadata("design:type", Boolean)
], Course.prototype, "active", void 0);
__decorate([
    Orm.Column({ default: false }),
    __metadata("design:type", Boolean)
], Course.prototype, "saved", void 0);
__decorate([
    Orm.Column({ type: "text", array: true }),
    __metadata("design:type", Array)
], Course.prototype, "tags", void 0);
__decorate([
    Orm.CreateDateColumn({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Course.prototype, "createdAt", void 0);
__decorate([
    Orm.UpdateDateColumn({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Course.prototype, "updatedAt", void 0);
__decorate([
    Orm.ManyToOne(() => user_entity_1.User, entity => entity.courses, {
        eager: true, cascade: ["update"], onDelete: "CASCADE"
    }),
    __metadata("design:type", user_entity_1.User)
], Course.prototype, "author", void 0);
__decorate([
    Orm.ManyToOne(() => category_entity_1.Category, entity => entity.courses, {
        eager: true, cascade: ["update"], onDelete: "CASCADE"
    }),
    __metadata("design:type", category_entity_1.Category)
], Course.prototype, "category", void 0);
__decorate([
    Orm.OneToMany(() => comment_entity_1.Comment, entity => entity.course, {
        cascade: ["update", "remove"], onDelete: "CASCADE"
    }),
    __metadata("design:type", Array)
], Course.prototype, "comments", void 0);
__decorate([
    Orm.ManyToMany(() => user_entity_1.User, entity => entity.purchasedCourses, {
        cascade: ["update"], onDelete: "CASCADE"
    }),
    __metadata("design:type", Array)
], Course.prototype, "customers", void 0);
Course = __decorate([
    Orm.Entity()
], Course);
exports.Course = Course;
//# sourceMappingURL=course.entity.js.map