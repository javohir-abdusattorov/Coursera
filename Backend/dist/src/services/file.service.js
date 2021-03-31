"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileService = void 0;
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const common_1 = require("@nestjs/common");
let FileService = class FileService {
    async uploadFile(file, uploadPath, getPath, fileName) {
        const name = `${fileName}${path.parse(file.name).ext}`;
        const filePath = path.join(uploadPath, name);
        await file.mv(filePath);
        return `${getPath}/${name}`;
    }
    validateFileType(file, type) {
        const fileMimeType = file.mimetype.split('/')[0];
        if (type == "image" && fileMimeType == "image")
            return true;
        else if (type == "video" && fileMimeType == "video")
            return true;
        return false;
    }
    async uploadCourseVideo(file) {
        const uploadPath = path.join(__dirname, "../../public/public-assets/course");
        const fileName = `[course]-${new Date().getTime()}-${crypto.randomBytes(24).toString("hex")}`;
        return this.uploadFile(file, uploadPath, `public-assets/course`, fileName);
    }
    async uploadUserImage(file) {
        const uploadPath = path.join(__dirname, "../../public/public-assets/user");
        const fileName = `[user]-${new Date().getTime()}-${crypto.randomBytes(24).toString("hex")}`;
        return this.uploadFile(file, uploadPath, `public-assets/user`, fileName);
    }
    async uploadCourseImage(file) {
        const uploadPath = path.join(__dirname, "../../public/public-assets/course-poster");
        const fileName = `[course-poster]-${new Date().getTime()}-${crypto.randomBytes(24).toString("hex")}`;
        return this.uploadFile(file, uploadPath, `public-assets/course-poster`, fileName);
    }
    deleteFiles(files) {
        for (let file of files) {
            const filePath = path.join(__dirname, `../../public/${file}`);
            if (fs.existsSync(filePath))
                fs.unlinkSync(filePath);
        }
    }
};
FileService = __decorate([
    common_1.Injectable()
], FileService);
exports.FileService = FileService;
//# sourceMappingURL=file.service.js.map