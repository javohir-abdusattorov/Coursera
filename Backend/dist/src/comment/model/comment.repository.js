"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const comment_entity_1 = require("./comment.entity");
let CommentRepository = class CommentRepository extends typeorm_1.Repository {
    constructor() {
        super(...arguments);
        this.logger = new common_1.Logger(`CommentRoutes`);
    }
    async findById(id, relations = []) {
        const comment = await this.findOne({ where: { id }, relations });
        if (!comment) {
            this.logger.warn(`Comment not found. ID [${id}]`);
            throw new common_1.NotFoundException(`Comment not found with id "${id}"`);
        }
        return comment;
    }
    async createComment(body, user, course) {
        const { message } = body;
        const newComment = new comment_entity_1.Comment();
        newComment.message = message;
        newComment.user = user;
        newComment.course = course;
        try {
            await newComment.save();
        }
        catch (err) {
            this.logger.warn(`Failed to create comment`, err);
            throw new common_1.BadRequestException("Invalid data!");
        }
        return newComment;
    }
    async updateComment(comment, body) {
        for (const [key, value] of Object.entries(body))
            comment[key] = value;
        try {
            await comment.save();
        }
        catch (err) {
            this.logger.warn(`Failed to edit comment`, err);
            throw new common_1.BadRequestException("Invalid data!");
        }
        return comment;
    }
};
CommentRepository = __decorate([
    typeorm_1.EntityRepository(comment_entity_1.Comment)
], CommentRepository);
exports.CommentRepository = CommentRepository;
//# sourceMappingURL=comment.repository.js.map