"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const user_roles_enum_1 = require("../enum/user-roles.enum");
const ADMIN_USERNAME = `course_admin`;
let UserRepository = class UserRepository extends typeorm_1.Repository {
    constructor() {
        super(...arguments);
        this.logger = new common_1.Logger(`Users:Repository`);
    }
    async findUser(username) {
        const user = await this.findOne({ username });
        if (!user) {
            this.logger.warn(`User not found. Username [${username}]`);
            throw new common_1.NotFoundException(`User not found with username "${username}"`);
        }
        return user;
    }
    async findById(id, relations = []) {
        const user = await this.findOne({ where: { id, role: user_roles_enum_1.UserRoles.USER }, relations });
        if (!user) {
            this.logger.warn(`User not found. ID [${id}]`);
            throw new common_1.NotFoundException(`User not found with id "${id}"`);
        }
        return user;
    }
    async findAdmin(relations = []) {
        return this.findOne({ where: { role: user_roles_enum_1.UserRoles.ADMIN }, relations });
    }
    async searchUser(q) {
        const query = this.createQueryBuilder("user");
        query.where(`(user.username LIKE :search)`, { search: `%${q}%` });
        return query.getMany();
    }
    async createUser(username, password) {
        this.logger.log(`User creating. Username [${username}]`);
        const newUser = new user_entity_1.User();
        newUser.username = username;
        newUser.password = password;
        try {
            await newUser.save();
        }
        catch (err) {
            if (err.code === "23505") {
                this.logger.error(`Failed to create user: username confict`);
                throw new common_1.ConflictException(`User with username "${username}" already exists. Try another one`);
            }
            else {
                this.logger.error(`Failed to create user`, err);
                throw new common_1.BadRequestException("Invalid data!");
            }
        }
        return newUser;
    }
    async updateUser(user, body) {
        let fields = [];
        for (const [key, value] of Object.entries(body)) {
            user[key] = value;
            fields.push(`${key}: ${value}`);
        }
        this.logger.log(`User [${user.username}] editing. Fields: [${fields.join(", ")}]`);
        try {
            await user.save();
        }
        catch (err) {
            this.logger.warn(`User failed to edit`, err);
            throw new common_1.BadRequestException("Invalid data!");
        }
        return user;
    }
    async createAdmin(password) {
        const newUser = new user_entity_1.User();
        newUser.username = ADMIN_USERNAME;
        newUser.role = user_roles_enum_1.UserRoles.ADMIN;
        newUser.password = password;
        newUser.account = 0;
        try {
            await newUser.save();
        }
        catch (err) {
            this.logger.error(`Error while creating ADMIN.`, err);
            if (err.code === "23505")
                throw new common_1.ConflictException(`Admin exists`);
            else
                throw new common_1.BadRequestException("Invalid data!");
        }
        return newUser;
    }
};
UserRepository = __decorate([
    typeorm_1.EntityRepository(user_entity_1.User)
], UserRepository);
exports.UserRepository = UserRepository;
//# sourceMappingURL=user.repository.js.map