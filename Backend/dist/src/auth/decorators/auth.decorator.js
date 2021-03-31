"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../jwt/roles.guard");
function Auth(...roles) {
    return common_1.applyDecorators(common_1.SetMetadata("roles", roles), common_1.UseGuards(passport_1.AuthGuard(), roles_guard_1.RolesGuard));
}
exports.Auth = Auth;
//# sourceMappingURL=auth.decorator.js.map