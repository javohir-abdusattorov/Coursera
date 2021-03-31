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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProvider = void 0;
const config = require("config");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_repository_1 = require("./model/user.repository");
const auth_provider_1 = require("../auth/auth.provider");
const file_service_1 = require("../services/file.service");
let UserProvider = class UserProvider {
    constructor(User, authService, fileService) {
        this.User = User;
        this.authService = authService;
        this.fileService = fileService;
        this.logger = new common_1.Logger(`App:Users`);
    }
    async createEditUserQuery(fields, user, body, files) {
        const query = {};
        for (const key of fields)
            if (body[key])
                query[key] = body[key];
        if (body.oldPassword && body.newPassword) {
            const isMatch = await this.authService.checkPassword(body.oldPassword, user.password);
            if (!isMatch)
                return [`Invalid password`];
            query["password"] = await this.authService.hashPassword(body.newPassword);
        }
        if (files && files.profilePicture) {
            const image = files.profilePicture;
            if (!this.fileService.validateFileType(image, "image"))
                return [`Invalid profile picture file type`];
            if (user.profilePicture !== config.user.defaultImage) {
                this.fileService.deleteFiles([user.profilePicture]);
            }
            query["profilePicture"] = await this.fileService.uploadUserImage(image);
        }
        return [false, query];
    }
    canUserSubscribe(user, channel) {
        if (channel.spam) {
            return `Channel in spam`;
        }
        if (user.subscriptions.some(item => item.id == channel.id)) {
            return `You already subscribed`;
        }
        return true;
    }
    async buyCourse(buyer, seller, price, course) {
        const admin = await this.User.findAdmin();
        buyer = await this.User.findOne({ where: { id: buyer.id }, relations: ["purchasedCourses"] });
        buyer.purchasedCourses.push(course);
        buyer.account += price.buyer;
        seller.account += price.seller;
        admin.account += price.admin;
        await buyer.save();
        await seller.save();
        await admin.save();
        return buyer;
    }
    async returnCourse(buyer, seller, price, course) {
        const admin = await this.User.findAdmin();
        buyer = await this.User.findOne({ where: { id: buyer.id }, relations: ["purchasedCourses"] });
        const i = buyer.purchasedCourses.findIndex(item => item.id === course.id);
        buyer.purchasedCourses.splice(i, 1);
        buyer.account += price.buyer;
        seller.account += price.seller;
        admin.account += price.admin;
        await buyer.save();
        await seller.save();
        await admin.save();
        return buyer;
    }
};
UserProvider = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(user_repository_1.UserRepository)),
    __param(1, common_1.Inject(common_1.forwardRef(() => auth_provider_1.AuthProvider))),
    __param(2, common_1.Inject(common_1.forwardRef(() => file_service_1.FileService))),
    __metadata("design:paramtypes", [user_repository_1.UserRepository,
        auth_provider_1.AuthProvider,
        file_service_1.FileService])
], UserProvider);
exports.UserProvider = UserProvider;
//# sourceMappingURL=user.provider.js.map