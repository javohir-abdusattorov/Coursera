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
exports.LogType = void 0;
const graphql_1 = require("@nestjs/graphql");
const log_type_enum_1 = require("../enum/log-type.enum");
let LogType = class LogType {
};
__decorate([
    graphql_1.Field(),
    __metadata("design:type", String)
], LogType.prototype, "type", void 0);
__decorate([
    graphql_1.Field(),
    __metadata("design:type", String)
], LogType.prototype, "message", void 0);
__decorate([
    graphql_1.Field(),
    __metadata("design:type", Number)
], LogType.prototype, "createdAt", void 0);
LogType = __decorate([
    graphql_1.ObjectType("Log")
], LogType);
exports.LogType = LogType;
//# sourceMappingURL=log.type.js.map