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
var User_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const Orm = require("typeorm");
const config = require("config");
const course_entity_1 = require("../../course/model/course.entity");
const comment_entity_1 = require("../../comment/model/comment.entity");
const user_roles_enum_1 = require("../enum/user-roles.enum");
let User = User_1 = class User extends Orm.BaseEntity {
};
__decorate([
    Orm.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    Orm.Column({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    Orm.Column(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    Orm.Column({ default: config.user.startingAccount, type: "float", scale: 1 }),
    __metadata("design:type", Number)
], User.prototype, "account", void 0);
__decorate([
    Orm.Column({ default: config.user.defaultImage }),
    __metadata("design:type", String)
], User.prototype, "profilePicture", void 0);
__decorate([
    Orm.Column({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "spam", void 0);
__decorate([
    Orm.Column({
        type: "enum",
        enum: user_roles_enum_1.UserRoles,
        default: user_roles_enum_1.UserRoles.USER
    }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    Orm.Column({ default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "subscribersCount", void 0);
__decorate([
    Orm.CreateDateColumn({ type: 'timestamp' }),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    Orm.UpdateDateColumn({ type: 'timestamp' }),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
__decorate([
    Orm.OneToMany(() => course_entity_1.Course, entity => entity.author, {
        cascade: ["update", "remove"], onDelete: "CASCADE"
    }),
    __metadata("design:type", Array)
], User.prototype, "courses", void 0);
__decorate([
    Orm.OneToMany(() => comment_entity_1.Comment, entity => entity.user, {
        cascade: ["update", "remove"], onDelete: "CASCADE"
    }),
    __metadata("design:type", Array)
], User.prototype, "comments", void 0);
__decorate([
    Orm.ManyToMany(() => course_entity_1.Course, entity => entity.customers, {
        cascade: ["update"], onDelete: "CASCADE"
    }),
    Orm.JoinTable(),
    __metadata("design:type", Array)
], User.prototype, "purchasedCourses", void 0);
__decorate([
    Orm.ManyToMany(() => course_entity_1.Course, {
        cascade: ["update"], onDelete: "CASCADE"
    }),
    Orm.JoinTable(),
    __metadata("design:type", Array)
], User.prototype, "savedCourses", void 0);
__decorate([
    Orm.ManyToMany(() => User_1, {
        cascade: ["update"], onDelete: "CASCADE"
    }),
    Orm.JoinTable(),
    __metadata("design:type", Array)
], User.prototype, "subscriptions", void 0);
User = User_1 = __decorate([
    Orm.Entity(),
    Orm.Unique(["username"])
], User);
exports.User = User;
//# sourceMappingURL=user.entity.js.map