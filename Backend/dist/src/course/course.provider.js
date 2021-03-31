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
exports.CourseProvider = void 0;
const config = require("config");
const dateEvents = require("date-events");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const course_repository_1 = require("./model/course.repository");
const main_1 = require("../main");
const file_service_1 = require("../services/file.service");
const category_repository_1 = require("../category/model/category.repository");
const logger_service_1 = require("../logger/logger.service");
const log_type_enum_1 = require("../logger/enum/log-type.enum");
const COURSE_RETURN_PERCENT = config.course.courseReturnPercent;
const SPAM_RETURN_PERCENT = config.course.spamReturnPercent;
const SPAM_PERCENT = config.course.spamPercent;
let CourseProvider = class CourseProvider {
    constructor(Course, Category, fileService, loggerService) {
        this.Course = Course;
        this.Category = Category;
        this.fileService = fileService;
        this.loggerService = loggerService;
        this.logger = new common_1.Logger(`CourseRoutes`);
    }
    async getAllDiscountedCourses() {
        return this.Course.find({ discount: true });
    }
    async createEditCourseQuery(course, keys, body, files) {
        const query = {};
        for (const key of keys)
            if (body[key])
                query[key] = body[key];
        if (body.price) {
            query["price"] = +body.price;
        }
        if (body.category && +body.category !== course.category.id) {
            query["category"] = await this.Category.findById(+body.category);
        }
        if (body.discount == true) {
            if (!body.discountPercent || !body.discountDeadline)
                return [`If you want to make discount, please send discount percent and discount deadline`];
            if (new Date() > body.discountDeadline)
                return [`Invalid discount date`];
            query["discount"] = true;
            query["discountPercent"] = body.discountPercent;
            query["discountDeadline"] = new Date(body.discountDeadline).getTime();
        }
        else if (body.discount == false) {
            query["discount"] = false;
            query["discountPercent"] = 0;
            query["discountDeadline"] = 0;
        }
        if (files && files.video) {
            const videoFile = files.video;
            if (!this.fileService.validateFileType(videoFile, "video"))
                return [`Invalid video file type`];
            this.fileService.deleteFiles([course.video]);
            query["video"] = await this.fileService.uploadCourseVideo(videoFile);
        }
        if (files && files.poster) {
            const posterFile = files.poster;
            if (!this.fileService.validateFileType(posterFile, "image"))
                return [`Invalid poster file type`];
            this.fileService.deleteFiles([course.poster]);
            query["poster"] = await this.fileService.uploadCourseImage(posterFile);
        }
        return [false, query];
    }
    canUserBuyCourse(user, course) {
        if (!course.active) {
            return `Course not found with id "${course.id}"`;
        }
        if (user.id === course.author.id) {
            return `Course added by yourself`;
        }
        if (course.customers.some(item => item.id === user.id)) {
            return `You have this course`;
        }
        return true;
    }
    canUserReturnCourse(user, course, price) {
        if (user.id === course.author.id) {
            return `Course added by yourself`;
        }
        if (!course.customers.some(item => item.id === user.id)) {
            return `You doesn't have this course`;
        }
        if (course.author.account < price) {
            return `Seller cannot return $${price}`;
        }
        return true;
    }
    canUserAddCourseToSaved(user, course) {
        if (!course.active) {
            return `Course not found with id "${course.id}"`;
        }
        if (user.savedCourses.some(item => item.id === course.id)) {
            return `You already saved course`;
        }
        return true;
    }
    async userBuyedCourse(course, user) {
        course.customers.push(user);
        course.sold++;
        await course.save();
    }
    async userReturnedCourse(course, user) {
        const i = course.customers.findIndex(item => item.id === user.id);
        course.customers.splice(i, 1);
        await course.save();
    }
    calculateCoursePrice(course, isSpam) {
        const coursePrice = this.round(course.discount ? course.price - ((course.price / 100) * course.discountPercent) : course.price, 1);
        if (isSpam) {
            const add = this.round((coursePrice / 100) * SPAM_PERCENT, 1);
            return {
                buyer: this.round(-(coursePrice + add), 1),
                seller: coursePrice,
                admin: add
            };
        }
        else {
            return {
                buyer: -coursePrice,
                seller: coursePrice,
                admin: 0
            };
        }
    }
    calculateCourseReturnPrice(course, isSpam) {
        const returnPrice = this.round(course.price - ((course.price / 100) * COURSE_RETURN_PERCENT), 1);
        if (isSpam) {
            const add = this.round((returnPrice / 100) * SPAM_RETURN_PERCENT, 1);
            return {
                seller: -returnPrice,
                buyer: this.round(returnPrice - add, 1),
                admin: add,
            };
        }
        else {
            return {
                seller: -returnPrice,
                buyer: returnPrice,
                admin: 0,
            };
        }
    }
    calculateCoursePriceForBuyer(course, buyerAccount, isSpam) {
        const result = {
            discount: false,
            spam: false,
            price: course.price,
            discountPrice: 0,
            spamPrice: 0,
            total: 0,
            canBuy: false,
        };
        if (course.discount) {
            result.discountPrice = this.round((course.price / 100) * course.discountPercent, 1);
            result.discount = true;
        }
        if (isSpam) {
            const currentPrice = result.discount ? result.price - result.discountPrice : result.price;
            result.spamPrice = this.round((currentPrice / 100) * SPAM_PERCENT, 1);
            result.spam = true;
        }
        result.total = (result.price - result.discountPrice) + result.spamPrice;
        if (buyerAccount >= result.total)
            result.canBuy = true;
        return result;
    }
    calculateCourseReturnPriceForBuyer(course, authorAccount, isSpam) {
        const result = {
            price: this.round(course.price - ((course.price / 100) * COURSE_RETURN_PERCENT), 1),
            spam: false,
            spamPrice: 0,
            total: 0,
            canReturn: false,
        };
        if (isSpam) {
            result.spamPrice = this.round((result.price / 100) * SPAM_RETURN_PERCENT, 1);
            result.spam = true;
        }
        result.total = result.price - result.spamPrice;
        if (authorAccount >= result.price)
            result.canReturn = true;
        return result;
    }
    calculateCourseRating(course, rate) {
        if (course.rating == 0)
            return this.round((rate * 2) / 2);
        const rating = (course.rating + rate) / 2;
        return this.round((rating * 2) / 2);
    }
    async endCoursesDiscount(date) {
        const all = await this.getAllDiscountedCourses();
        for (const course of all) {
            if (new Date(+course.discountDeadline) <= date) {
                await this.removeCourseDiscount(course);
                this.loggerService.log(course.author.id, log_type_enum_1.LogTypes.WARN, `Your course (${course.title})'s discount ended`);
            }
        }
    }
    async removeCourseDiscount(course) {
        await this.Course.updateCourse(course, {
            discount: false,
            discountPercent: 0,
            discountDeadline: 0,
        });
    }
    async deleteCourse(course) {
        this.fileService.deleteFiles([course.video, course.poster]);
        await course.remove();
    }
    round(value, precision = 0) {
        const multiplier = Math.pow(10, precision || 0);
        return Math.round(value * multiplier) / multiplier;
    }
};
CourseProvider = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(course_repository_1.CourseRepository)),
    __param(1, typeorm_1.InjectRepository(category_repository_1.CategoryRepository)),
    __param(2, common_1.Inject(common_1.forwardRef(() => file_service_1.FileService))),
    __param(3, common_1.Inject(common_1.forwardRef(() => logger_service_1.LoggerService))),
    __metadata("design:paramtypes", [course_repository_1.CourseRepository,
        category_repository_1.CategoryRepository,
        file_service_1.FileService,
        logger_service_1.LoggerService])
], CourseProvider);
exports.CourseProvider = CourseProvider;
const clock = dateEvents();
const per = config.course.checkDiscountMinute;
clock.on("second", async () => {
    if (!main_1.app)
        return;
    const sec = new Date().getSeconds();
    if (sec !== 30 && sec !== 0)
        return;
    const date = new Date();
    const service = main_1.app.get(CourseProvider);
    await service.endCoursesDiscount(date);
});
//# sourceMappingURL=course.provider.js.map