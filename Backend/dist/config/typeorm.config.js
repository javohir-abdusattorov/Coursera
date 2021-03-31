"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmConfig = void 0;
const path = require("path");
const config = require("config");
const dbConfig = config.db;
exports.TypeOrmConfig = {
    type: dbConfig.type,
    host: dbConfig.host,
    port: dbConfig.port,
    username: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.database,
    synchronize: dbConfig.synchronize,
    entities: [path.join(__dirname, '/../**/**.entity{.ts,.js}')],
};
//# sourceMappingURL=typeorm.config.js.map