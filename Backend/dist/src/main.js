"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const path = require("path");
const config = require("config");
const fileUpload = require("express-fileupload");
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const serverConfig = config.get("server");
const staticFilesPath = path.join(__dirname, "../public");
async function bootstrap() {
    exports.app = await core_1.NestFactory.create(app_module_1.AppModule);
    const logger = new common_2.Logger("Root");
    exports.app.enableCors();
    exports.app.useStaticAssets(staticFilesPath);
    exports.app.use(fileUpload());
    exports.app.useGlobalPipes(new common_1.ValidationPipe());
    const port = process.env.PORT || serverConfig.port;
    await exports.app.listen(port);
    console.clear();
    logger.verbose(`Application running on port ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map