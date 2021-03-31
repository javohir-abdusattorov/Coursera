
import * as Orm from "typeorm"
import * as config from "config"
import { Course } from "../../course/model/course.entity"
import { Comment } from "../../comment/model/comment.entity"
import { UserRoles } from "../enum/user-roles.enum"


@Orm.Entity()
@Orm.Unique(["username"])
export class User extends Orm.BaseEntity {

	@Orm.PrimaryGeneratedColumn()
	readonly id: number

	@Orm.Column({ unique: true })
	username: string

	@Orm.Column()
	password: string

	@Orm.Column({ default: config.user.startingAccount, type: "float", scale: 1 })
	account: number

	@Orm.Column({ default: config.user.defaultImage })
	profilePicture: string

  @Orm.Column({ default: false })
  spam: boolean

  @Orm.Column({
    type: "enum",
    enum: UserRoles,
    default: UserRoles.USER
  })
  role: UserRoles

  @Orm.Column({ default: 0 })
  subscribersCount: number

  @Orm.CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @Orm.UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date


  // Relations
  @Orm.OneToMany(() => Course, entity => entity.author, {
  	cascade: ["update", "remove"], onDelete: "CASCADE"
  })
	courses: Course[]

  @Orm.OneToMany(() => Comment, entity => entity.user, {
  	cascade: ["update", "remove"], onDelete: "CASCADE"
  })
	comments: Comment[]

  @Orm.ManyToMany(() => Course, entity => entity.customers, {
  	cascade: ["update"], onDelete: "CASCADE"
  })
  @Orm.JoinTable()
	purchasedCourses: Course[]

  @Orm.ManyToMany(() => Course, {
    cascade: ["update"], onDelete: "CASCADE"
  })
  @Orm.JoinTable()
  savedCourses: Course[]

  @Orm.ManyToMany(() => User, {
    cascade: ["update"], onDelete: "CASCADE"
  })
  @Orm.JoinTable()
  subscriptions: User[]
}