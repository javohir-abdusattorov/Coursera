
import { Logger, BadRequestException, NotFoundException, ConflictException } from "@nestjs/common"
import { EntityRepository, Repository } from "typeorm"

import { User } from "./user.entity"
import { UserRoles } from "../enum/user-roles.enum"


const ADMIN_USERNAME = `course_admin`

@EntityRepository(User)
export class UserRepository extends Repository<User> {
	private logger = new Logger(`Users:Repository`)


	async findUser(username: string): Promise<User> {
		const user = await this.findOne({ username })
		if (!user) {
			this.logger.warn(`User not found. Username [${username}]`)
			throw new NotFoundException(`User not found with username "${username}"`)
		}
		return user
	}

	async findById(id: number, relations: string[] = []): Promise<User> {
		const user = await this.findOne({ where: { id, role: UserRoles.USER }, relations })
		if (!user) {
			this.logger.warn(`User not found. ID [${id}]`)
			throw new NotFoundException(`User not found with id "${id}"`)
		}
		return user
	}

	async findAdmin(relations: string[] = []): Promise<User> {
		return this.findOne({ where: { role: UserRoles.ADMIN }, relations })
	}

	async searchUser(q: string): Promise<User[]> {
		const query = this.createQueryBuilder("user")
		query.where(`(user.username LIKE :search)`, { search: `%${q}%` })
		return query.getMany()
	}

	async createUser(username: string, password: string): Promise<User> {
		this.logger.log(`User creating. Username [${username}]`)
		const newUser = new User()

		newUser.username = username
		newUser.password = password

		try { await newUser.save() }
		catch (err) {
			if (err.code === "23505") {
				this.logger.error(`Failed to create user: username confict`)
				throw new ConflictException(`User with username "${username}" already exists. Try another one`)
			}	else {
				this.logger.error(`Failed to create user`, err)
				throw new BadRequestException("Invalid data!")	
			}		
		}
		return newUser
	}

	async updateUser(user: User, body: Object): Promise<User> {
		let fields = []
		for (const [key, value] of Object.entries(body)) {
			user[key] = value
			fields.push(`${key}: ${value}`)
		}
		this.logger.log(`User [${user.username}] editing. Fields: [${fields.join(", ")}]`)

		try { await user.save() }
		catch (err) {
			this.logger.warn(`User failed to edit`, err)
			throw new BadRequestException("Invalid data!")
		}
		return user
	}

	async createAdmin(password: string): Promise<User> {
		const newUser = new User()

		newUser.username = ADMIN_USERNAME
		newUser.role = UserRoles.ADMIN
		newUser.password = password
		newUser.account = 0

		try { await newUser.save() }
		catch (err) {
			this.logger.error(`Error while creating ADMIN.`, err)
			if (err.code === "23505") throw new ConflictException(`Admin exists`)
			else throw new BadRequestException("Invalid data!")			
		}

		return newUser
	}
}