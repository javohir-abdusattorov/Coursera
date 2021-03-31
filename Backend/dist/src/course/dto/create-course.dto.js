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
exports.CreateCourseDto = void 0;
const validator = require("class-validator");
class CreateCourseDto {
}
__decorate([
    validator.IsNotEmpty(),
    validator.IsString(),
    __metadata("design:type", String)
], CreateCourseDto.prototype, "title", void 0);
__decorate([
    validator.IsNotEmpty(),
    validator.IsString(),
    __metadata("design:type", String)
], CreateCourseDto.prototype, "description", void 0);
__decorate([
    validator.IsNumber(),
    validator.IsPositive(),
    __metadata("design:type", String)
], CreateCourseDto.prototype, "price", void 0);
__decorate([
    validator.IsArray(),
    validator.ArrayNotEmpty(),
    validator.ArrayUnique(),
    __metadata("design:type", Array)
], CreateCourseDto.prototype, "tags", void 0);
__decorate([
    validator.IsNumber(),
    validator.IsPositive(),
    __metadata("design:type", String)
], CreateCourseDto.prototype, "category", void 0);
exports.CreateCourseDto = CreateCourseDto;
//# sourceMappingURL=create-course.dto.js.map