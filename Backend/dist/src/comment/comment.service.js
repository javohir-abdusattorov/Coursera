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
exports.CommentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const comment_repository_1 = require("./model/comment.repository");
const course_repository_1 = require("../course/model/course.repository");
const logger_service_1 = require("../logger/logger.service");
const log_type_enum_1 = require("../logger/enum/log-type.enum");
let CommentService = class CommentService {
    constructor(Comment, Course, loggerService) {
        this.Comment = Comment;
        this.Course = Course;
        this.loggerService = loggerService;
        this.logger = new common_1.Logger(`CommentRoutes`);
    }
    async getAllComments() {
        this.logger.log(`Graphql client sending query [getAllComments]`);
        return this.Comment.find();
    }
    async getComment(id) {
        this.logger.log(`Graphql client sending query [getComment]. ID [${id}]`);
        return this.Comment.findById(id);
    }
    async _getCommentUser(comment) {
        const { user } = await this.Comment.findById(comment.id, ["user"]);
        return user;
    }
    async _getCommentCourse(comment) {
        const { course } = await this.Comment.findById(comment.id, ["course"]);
        return course;
    }
    async postComment(user, id, body) {
        this.logger.log(`User [${user.username}] trying to post comment to course [${id}]`);
        const course = await this.Course.findById(id, ["customers"]);
        if (user.spam) {
            this.logger.warn(`User [${user.username}] failed to post comment: user is spammed`);
            throw new common_1.BadRequestException(`You are cannot post comment`);
        }
        if (!course.customers.some(item => item.id === user.id)) {
            this.logger.warn(`User [${user.username}] failed to post comment: user doesn't have course`);
            throw new common_1.BadRequestException(`You doesn't have this course`);
        }
        const createdComment = await this.Comment.createComment(body, user, course);
        this.logger.verbose(`User [${user.username}] posted comment to course [${id}]`);
        this.loggerService.log(course.author.id, log_type_enum_1.LogTypes.INFO, `User (${user.username}) posted <comment> to your course (${course.title}). Message: "${body.message}"`);
        return createdComment;
    }
    async editComment(user, id, body) {
        this.logger.log(`User [${user.username}] trying to edit comment [${id}]`);
        const comment = await this.Comment.findById(id, ["user"]);
        if (comment.user.id !== user.id) {
            this.logger.warn(`User [${user.username}] failed to edit comment: permission`);
            throw new common_1.BadRequestException(`Not your comment`);
        }
        if (body.message == comment.message) {
            this.logger.warn(`User [${user.username}] failed to edit comment: message same`);
            throw new common_1.BadRequestException(`Same message`);
        }
        const updatedComment = await this.Comment.updateComment(comment, { message: body.message });
        this.logger.verbose(`User [${user.username}] edited comment [${id}]`);
        return updatedComment;
    }
    async deleteComment(user, id) {
        this.logger.log(`User [${user.username}] trying to delete comment [${id}]`);
        const comment = await this.Comment.findById(id, ["user"]);
        if (comment.user.id !== user.id) {
            this.logger.warn(`User [${user.username}] failed to delete comment: permission`);
            throw new common_1.BadRequestException(`Not your comment`);
        }
        await comment.remove();
        this.logger.verbose(`User [${user.username}] deleted comment [${id}]`);
    }
    async deleteCommentByAdmin(id) {
        const comment = await this.Comment.findById(id);
        await comment.remove();
        this.logger.verbose(`[Admin] deleted comment [${id}]`);
    }
};
CommentService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(comment_repository_1.CommentRepository)),
    __param(1, typeorm_1.InjectRepository(course_repository_1.CourseRepository)),
    __param(2, common_1.Inject(common_1.forwardRef(() => logger_service_1.LoggerService))),
    __metadata("design:paramtypes", [comment_repository_1.CommentRepository,
        course_repository_1.CourseRepository,
        logger_service_1.LoggerService])
], CommentService);
exports.CommentService = CommentService;
//# sourceMappingURL=comment.service.js.map