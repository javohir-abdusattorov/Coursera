"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestUser = void 0;
const common_1 = require("@nestjs/common");
exports.RequestUser = common_1.createParamDecorator((data, ctx) => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
});
//# sourceMappingURL=request-user.decorator.js.map