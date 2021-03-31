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
exports.Logger = void 0;
const Orm = require("typeorm");
const user_entity_1 = require("../../user/model/user.entity");
let Logger = class Logger extends Orm.BaseEntity {
};
__decorate([
    Orm.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Logger.prototype, "id", void 0);
__decorate([
    Orm.Column({
        type: "jsonb",
        nullable: true,
    }),
    __metadata("design:type", Array)
], Logger.prototype, "logs", void 0);
__decorate([
    Orm.CreateDateColumn({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Logger.prototype, "createdAt", void 0);
__decorate([
    Orm.UpdateDateColumn({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Logger.prototype, "updatedAt", void 0);
__decorate([
    Orm.OneToOne(() => user_entity_1.User, {
        eager: true, cascade: ["update"], onDelete: "CASCADE"
    }),
    Orm.JoinColumn(),
    __metadata("design:type", user_entity_1.User)
], Logger.prototype, "user", void 0);
Logger = __decorate([
    Orm.Entity()
], Logger);
exports.Logger = Logger;
//# sourceMappingURL=logger.entity.js.map