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
exports.ParserGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
let ParserGuard = class ParserGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const data = this.reflector.get('data', context.getHandler());
        if (!data || !data.length)
            return true;
        const req = context.switchToHttp().getRequest();
        this.parseBody(data, req);
        return true;
    }
    parseBody(data, req) {
        for (const item of data) {
            const [key, type] = item.split("::");
            if (req.body[key] && typeof (req.body[key]) == "string") {
                const bodyItem = req.body[key];
                let parsed;
                if (type == "number") {
                    parsed = +bodyItem;
                }
                else if (type == "date") {
                    if (typeof (+bodyItem) !== "number")
                        throw new common_1.BadRequestException([`"${key}" must be date number`]);
                    parsed = new Date(+bodyItem);
                }
                else if (type == "json") {
                    try {
                        parsed = JSON.parse(bodyItem);
                    }
                    catch (err) {
                        throw new common_1.BadRequestException([`"${key}" must be valid JSON`]);
                    }
                }
                req.body[key] = parsed;
            }
        }
    }
};
ParserGuard = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [core_1.Reflector])
], ParserGuard);
exports.ParserGuard = ParserGuard;
//# sourceMappingURL=parse-request.middleware.js.map