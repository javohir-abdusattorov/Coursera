"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphqlConfig = void 0;
const config = require("config");
const graphqlConfig = config.graphql;
exports.GraphqlConfig = {
    autoSchemaFile: graphqlConfig.autoSchemaFile,
    playground: graphqlConfig.playground,
    path: graphqlConfig.path,
};
//# sourceMappingURL=graphql.config.js.map