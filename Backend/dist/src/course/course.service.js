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
exports.CourseService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const course_provider_1 = require("./course.provider");
const course_entity_1 = require("./model/course.entity");
const course_repository_1 = require("./model/course.repository");
const file_service_1 = require("../services/file.service");
const category_repository_1 = require("../category/model/category.repository");
const user_entity_1 = require("../user/model/user.entity");
const user_provider_1 = require("../user/user.provider");
const user_repository_1 = require("../user/model/user.repository");
const category_entity_1 = require("../category/model/category.entity");
const comment_entity_1 = require("../comment/model/comment.entity");
const logger_service_1 = require("../logger/logger.service");
const log_type_enum_1 = require("../logger/enum/log-type.enum");
let CourseService = class CourseService {
    constructor(provider, Course, Category, User, fileService, userService, loggerService) {
        this.provider = provider;
        this.Course = Course;
        this.Category = Category;
        this.User = User;
        this.fileService = fileService;
        this.userService = userService;
        this.loggerService = loggerService;
        this.logger = new common_1.Logger(`CourseRoutes`);
    }
    async getAllCourses() {
        this.logger.log(`Graphql client sending query [getAllCourses]`);
        return this.Course.find();
    }
    async getCourse(id) {
        this.logger.log(`Graphql client sending query [getCourse]. ID [${id}]`);
        const course = await this.Course.findById(id);
        return course;
    }
    async searchCourse(q) {
        this.logger.log(`Graphql client sending query [searchCourse]. Search by [${q}]`);
        return this.Course.searchCourse(q);
    }
    async getMyCourses(user) {
        this.logger.log(`Graphql client sending query [getMyCourses]. User [${user.username}]`);
        return this.Course.find({ author: { id: user.id } });
    }
    async getAuthorCourses(id) {
        this.logger.log(`Graphql client sending query [getAuthorCourses]. User [${id}]`);
        const { courses } = await this.User.findById(id, ["courses"]);
        return courses;
    }
    async getCategoryCourses(id) {
        this.logger.log(`Graphql client sending query [getCategoryCourses]. Category [${id}]`);
        const { courses } = await this.Category.findById(id, ["courses"]);
        return courses;
    }
    async getDiscountCourses() {
        this.logger.log(`Graphql client sending query [getDiscountCourses]`);
        return this.Course.find({ discount: true });
    }
    async getSavedCourses() {
        this.logger.log(`Graphql client sending query [getDiscountCourses]`);
        return this.Course.find({ saved: true });
    }
    async getCoursesByTags(tags) {
        this.logger.log(`Graphql client sending query [getCoursesByTags]. Tags [${tags.join(", ")}]`);
        return this.Course.searchByTags(tags);
    }
    async getFavouriteCourses(user) {
        this.logger.log(`Graphql client sending query [getFavouriteCourses]. User [${user.username}]`);
        const { savedCourses } = await this.User.findById(user.id, ["savedCourses"]);
        return savedCourses;
    }
    async _getCourseAuthor(course) {
        const { author } = await this.Course.findById(course.id, ["author"]);
        return author;
    }
    async _getCourseCategory(course) {
        const { category } = await this.Course.findById(course.id, ["category"]);
        return category;
    }
    async _getCourseComments(course) {
        const { comments } = await this.Course.findById(course.id, ["comments"]);
        return comments;
    }
    async _getCourseCustomers(course) {
        const { customers } = await this.Course.findById(course.id, ["customers"]);
        return customers;
    }
    async createCourse(user, body, files) {
        this.logger.log(`User [${user.username}] trying to create course`);
        const { title, description, price, tags, category } = body;
        const courseCategory = await this.Category.findById(+category);
        if (!files || !files.video) {
            this.logger.warn(`User [${user.username}] failed to create course: no video`);
            throw new common_1.BadRequestException(`Please upload course video`);
        }
        const videoFile = files.video;
        if (!this.fileService.validateFileType(videoFile, "video")) {
            this.logger.warn(`User [${user.username}] failed to create course: invalid video type`);
            throw new common_1.BadRequestException(`Invalid video file type`);
        }
        if (!files.poster) {
            this.logger.warn(`User [${user.username}] failed to create course: no poster`);
            throw new common_1.BadRequestException(`Please upload course poster`);
        }
        const posterFile = files.poster;
        if (!this.fileService.validateFileType(posterFile, "image")) {
            this.logger.warn(`User [${user.username}] failed to create course: invalid image type`);
            throw new common_1.BadRequestException(`Invalid image file type`);
        }
        const newCourse = await this.Course.createCourse({
            title, description, tags,
            price: +price,
            author: user,
            category: courseCategory,
            video: await this.fileService.uploadCourseVideo(videoFile),
            poster: await this.fileService.uploadCourseImage(posterFile),
        });
        this.logger.verbose(`User [${user.username}] created course. ID [${newCourse.id}]`);
        this.loggerService.log(user.id, log_type_enum_1.LogTypes.SUCCESS, `You added new course! Course ID: <${newCourse.id}>. Waiting for admin to activate course`);
        return newCourse;
    }
    async editCourse(user, id, body, files) {
        this.logger.log(`User [${user.username}] trying to edit course [${id}]`);
        const course = await this.Course.findById(id);
        if (course.author.id !== user.id) {
            this.logger.warn(`User [${user.username}] failed to edit course: permission`);
            throw new common_1.NotFoundException(`Course not found with id ${id}`);
        }
        const fields = ["title", "description", "tags"];
        const [error, query] = await this.provider.createEditCourseQuery(course, fields, body, files);
        if (error) {
            this.logger.warn(`User [${user.username}] failed to edit course: ${error}`);
            throw new common_1.BadRequestException(error);
        }
        if (!Object.entries(query).length) {
            this.logger.warn(`User [${user.username}] failed to edit course: no data`);
            throw new common_1.BadRequestException("No data");
        }
        const updatedCourse = await this.Course.updateCourse(course, query);
        this.logger.verbose(`User [${user.username}] edited course [${id}]`);
        this.loggerService.log(user.id, log_type_enum_1.LogTypes.SUCCESS, `You <edited> your course (${updatedCourse.title})`);
        return updatedCourse;
    }
    async addCourseToSaved(user, id) {
        this.logger.log(`User [${user.username}] trying to add course [${id}] to saved`);
        const course = await this.Course.findById(id);
        user = await this.User.findById(user.id, ["savedCourses"]);
        const validationResult = this.provider.canUserAddCourseToSaved(user, course);
        if (validationResult !== true) {
            this.logger.warn(`User [${user.username}] failed to add course to saved: ${validationResult}`);
            throw new common_1.BadRequestException(validationResult);
        }
        user.savedCourses.push(course);
        await user.save();
        this.logger.verbose(`User [${user.username}] added course [${id}] to saved`);
    }
    async removeCourseFromSaved(user, id) {
        this.logger.log(`User [${user.username}] trying to remove course [${id}] from saved`);
        const course = await this.Course.findById(id);
        user = await this.User.findById(user.id, ["savedCourses"]);
        const i = user.savedCourses.findIndex(item => item.id === course.id);
        if (i < 0) {
            this.logger.warn(`User [${user.username}] failed to remove course from saved: not saved`);
            throw new common_1.BadRequestException(`You not saved course`);
        }
        user.savedCourses.splice(i, 1);
        await user.save();
        this.logger.verbose(`User [${user.username}] removed course [${id}] from saved`);
    }
    async canBuyCourse(user, id) {
        this.logger.log(`User [${user.username}] checking if he/she can buy course [${id}]`);
        const course = await this.Course.findById(id, ["customers"]);
        const validationResult = this.provider.canUserBuyCourse(user, course);
        if (validationResult !== true) {
            this.logger.warn(`User [${user.username}] cannot buy course: ${validationResult}`);
            throw new common_1.BadRequestException(validationResult);
        }
        const result = this.provider.calculateCoursePriceForBuyer(course, user.account, user.spam);
        this.logger.log(`User [${user.username}] ${result.canBuy ? "can" : "cannot"} buy course [${id}]`);
        return result;
    }
    async canReturnCourse(user, id) {
        this.logger.log(`User [${user.username}] checking if he/she can return course [${id}]`);
        const course = await this.Course.findById(id, ["customers"]);
        const price = this.provider.calculateCourseReturnPrice(course, user.spam);
        const validationResult = this.provider.canUserReturnCourse(user, course, price.seller);
        if (validationResult !== true) {
            this.logger.warn(`User [${user.username}] cannot return course: ${validationResult}`);
            throw new common_1.BadRequestException(validationResult);
        }
        const result = this.provider.calculateCourseReturnPriceForBuyer(course, user.account, user.spam);
        this.logger.log(`User [${user.username}] ${result.canReturn ? "can" : "cannot"} return course [${id}]`);
        return result;
    }
    async buyCourse(id, user) {
        this.logger.log(`User [${user.username}] trying to buy course [${id}]`);
        const course = await this.Course.findById(id, ["customers"]);
        const validationResult = this.provider.canUserBuyCourse(user, course);
        if (validationResult !== true) {
            this.logger.warn(`User [${user.username}] failed to buy course: ${validationResult}`);
            throw new common_1.BadRequestException(validationResult);
        }
        const price = this.provider.calculateCoursePrice(course, user.spam);
        if (user.account < price.buyer) {
            throw new common_1.BadRequestException(`You can't buy this course. Course price is $${course.price}, you have $${user.account}`);
        }
        user = await this.userService.buyCourse(user, course.author, price, course);
        await this.provider.userBuyedCourse(course, user);
        this.logger.verbose(`User [${user.username}] purchased course [${id}]. Price [${price}]`);
        this.loggerService.log(course.author.id, log_type_enum_1.LogTypes.INFO, `Your course (${course.title}) was purchased by (${user.username}). Your account has been replenished for <+$${Math.abs(price.seller)}>`);
        this.loggerService.log(user.id, log_type_enum_1.LogTypes.SUCCESS, `You successfuly bought course (${course.title}). Your account has been replenished for <-$${Math.abs(price.buyer)}>`);
    }
    async returnCourse(id, user) {
        this.logger.log(`User [${user.username}] trying to return course [${id}]`);
        const course = await this.Course.findById(id, ["customers"]);
        const price = this.provider.calculateCourseReturnPrice(course, user.spam);
        const validationResult = this.provider.canUserReturnCourse(user, course, price.seller);
        if (validationResult !== true) {
            this.logger.warn(`User [${user.username}] failed to return course: ${validationResult}`);
            throw new common_1.BadRequestException(validationResult);
        }
        user = await this.userService.returnCourse(user, course.author, price, course);
        await this.provider.userReturnedCourse(course, user);
        this.logger.verbose(`User [${user.username}] returned course [${id}]. Price [${price}]`);
        this.loggerService.log(course.author.id, log_type_enum_1.LogTypes.WARN, `Your course (${course.title}) was returned by (${user.username}). Your account has been replenished for <-$${Math.abs(price.seller)}>`);
        this.loggerService.log(user.id, log_type_enum_1.LogTypes.SUCCESS, `You returned course (${course.title}). Your account has been replenished for <+$${Math.abs(price.buyer)}>`);
    }
    async rateCourse(id, user, rating) {
        if (!rating || rating < 1 || rating > 5) {
            throw new common_1.BadRequestException(`Rating must be at least 1 star and max 5 star`);
        }
        this.logger.log(`User [${user.username}] trying to rate course [${id}]`);
        const course = await this.Course.findById(id, ["customers"]);
        if (!course.customers.some(item => item.id === user.id)) {
            this.logger.warn(`User [${user.username}] failed to rate course: permission`);
            throw new common_1.BadRequestException(`You cannot rate courses that you are not purchased`);
        }
        const courseRating = this.provider.calculateCourseRating(course, rating);
        const updatedCourse = await this.Course.updateCourse(course, { rating: courseRating });
        this.logger.log(`User [${user.username}] rated course [${id}]. Rating [${rating}]`);
        this.loggerService.log(course.author.id, log_type_enum_1.LogTypes.INFO, `Your course (${course.title}) was rated by (${user.username}). Rating: <${rating}>`);
        return updatedCourse.rating;
    }
    async activateCourse(id) {
        this.logger.log(`[Admin] trying to active course [${id}]`);
        const course = await this.Course.findById(id);
        if (course.active) {
            this.logger.warn(`[Admin] failed to active course: already activated`);
            throw new common_1.BadRequestException("Course already activated");
        }
        const updatedCourse = await this.Course.updateCourse(course, { active: true });
        this.logger.verbose(`[Admin] activated course [${id}]`);
        this.loggerService.log(updatedCourse.author.id, log_type_enum_1.LogTypes.SUCCESS, `Your course (${updatedCourse.title}) was activated. Now it is possible to <sell> the course`);
        return updatedCourse;
    }
    async disableCourse(id) {
        this.logger.log(`[Admin] trying to disable course [${id}]`);
        const course = await this.Course.findById(id);
        if (course.active) {
            this.logger.warn(`[Admin] failed to disable course: already activated`);
            throw new common_1.BadRequestException("Course already active");
        }
        await this.provider.deleteCourse(course);
        this.logger.verbose(`[Admin] deleted course [${id}]`);
        this.loggerService.log(course.author.id, log_type_enum_1.LogTypes.DANGER, `Your course (${course.title}) was <deleted> by admin.`);
    }
    async toggleSaved(id) {
        this.logger.log(`[Admin] trying to toggle saved course [${id}]`);
        const course = await this.Course.findById(id);
        const updateCourse = await this.Course.updateCourse(course, { saved: !course.saved });
        this.logger.verbose(`[Admin] toggled course saved [${id}]. Saved: ${updateCourse.saved}`);
        if (updateCourse.saved) {
            this.loggerService.log(course.author.id, log_type_enum_1.LogTypes.SUCCESS, `Your course (${course.title}) was added to saved courses of admin. And your course will appear first on the main page`);
        }
        else {
            this.loggerService.log(course.author.id, log_type_enum_1.LogTypes.WARN, `Your course (${course.title}) was removed from saved courses of admin`);
        }
        return updateCourse;
    }
    async deleteCourse(id, user) {
        this.logger.log(`User [${user.username}] trying to delete course [${id}]`);
        const course = await this.Course.findById(id);
        if (course.author.id !== user.id) {
            this.logger.warn(`User [${user.username}] failed to delete course: permission`);
            throw new common_1.NotFoundException(`Course not found with id ${id}`);
        }
        await this.provider.deleteCourse(course);
        this.logger.verbose(`User [${user.username}] deleted course [${id}]`);
        this.loggerService.log(course.author.id, log_type_enum_1.LogTypes.SUCCESS, `Your course (${course.title}) <deleted> successfuly`);
    }
    async clearDB() {
        await category_entity_1.Category.delete({});
        await comment_entity_1.Comment.delete({});
        await course_entity_1.Course.delete({});
        await user_entity_1.User.delete({});
    }
};
CourseService = __decorate([
    common_1.Injectable(),
    __param(1, typeorm_1.InjectRepository(course_repository_1.CourseRepository)),
    __param(2, typeorm_1.InjectRepository(category_repository_1.CategoryRepository)),
    __param(3, typeorm_1.InjectRepository(user_repository_1.UserRepository)),
    __param(4, common_1.Inject(common_1.forwardRef(() => file_service_1.FileService))),
    __param(5, common_1.Inject(common_1.forwardRef(() => user_provider_1.UserProvider))),
    __param(6, common_1.Inject(common_1.forwardRef(() => logger_service_1.LoggerService))),
    __metadata("design:paramtypes", [course_provider_1.CourseProvider,
        course_repository_1.CourseRepository,
        category_repository_1.CategoryRepository,
        user_repository_1.UserRepository,
        file_service_1.FileService,
        user_provider_1.UserProvider,
        logger_service_1.LoggerService])
], CourseService);
exports.CourseService = CourseService;
//# sourceMappingURL=course.service.js.map