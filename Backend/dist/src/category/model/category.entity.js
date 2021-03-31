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
exports.Category = void 0;
const Orm = require("typeorm");
const course_entity_1 = require("../../course/model/course.entity");
let Category = class Category extends Orm.BaseEntity {
};
__decorate([
    Orm.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Category.prototype, "id", void 0);
__decorate([
    Orm.Column({ unique: true }),
    __metadata("design:type", String)
], Category.prototype, "name", void 0);
__decorate([
    Orm.OneToMany(() => course_entity_1.Course, entity => entity.category, {
        cascade: ["update"], onDelete: "CASCADE"
    }),
    __metadata("design:type", Array)
], Category.prototype, "courses", void 0);
__decorate([
    Orm.CreateDateColumn({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Category.prototype, "createdAt", void 0);
__decorate([
    Orm.UpdateDateColumn({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Category.prototype, "updatedAt", void 0);
Category = __decorate([
    Orm.Entity(),
    Orm.Unique(["name"])
], Category);
exports.Category = Category;
//# sourceMappingURL=category.entity.js.map