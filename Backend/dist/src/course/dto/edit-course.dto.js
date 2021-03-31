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
exports.EditCourseDto = void 0;
const validator = require("class-validator");
class EditCourseDto {
}
__decorate([
    validator.IsOptional(),
    validator.IsNotEmpty(),
    validator.IsString(),
    __metadata("design:type", String)
], EditCourseDto.prototype, "title", void 0);
__decorate([
    validator.IsOptional(),
    validator.IsNotEmpty(),
    validator.IsString(),
    __metadata("design:type", String)
], EditCourseDto.prototype, "description", void 0);
__decorate([
    validator.IsOptional(),
    validator.IsNumber(),
    validator.IsPositive(),
    __metadata("design:type", Number)
], EditCourseDto.prototype, "price", void 0);
__decorate([
    validator.IsOptional(),
    validator.IsArray(),
    validator.ArrayNotEmpty(),
    validator.ArrayUnique(),
    __metadata("design:type", Array)
], EditCourseDto.prototype, "tags", void 0);
__decorate([
    validator.IsOptional(),
    validator.IsNumber(),
    validator.IsPositive(),
    __metadata("design:type", Number)
], EditCourseDto.prototype, "category", void 0);
__decorate([
    validator.IsOptional(),
    validator.IsBoolean(),
    __metadata("design:type", Boolean)
], EditCourseDto.prototype, "discount", void 0);
__decorate([
    validator.IsOptional(),
    validator.IsNumber(),
    validator.Min(1),
    validator.Max(100),
    __metadata("design:type", Number)
], EditCourseDto.prototype, "discountPercent", void 0);
__decorate([
    validator.IsOptional(),
    validator.IsDate(),
    __metadata("design:type", Date)
], EditCourseDto.prototype, "discountDeadline", void 0);
exports.EditCourseDto = EditCourseDto;
//# sourceMappingURL=edit-course.dto.js.map