"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtOptions = void 0;
const config = require("config");
const jwtConfig = config.get("jwt");
exports.JwtOptions = {
    secret: jwtConfig.secret,
    signOptions: {
        expiresIn: jwtConfig.expiresIn
    }
};
//# sourceMappingURL=jwt.config.js.map