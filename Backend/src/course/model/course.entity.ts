
import * as Orm from "typeorm"
import { User } from "../../user/model/user.entity"
import { Comment } from "../../comment/model/comment.entity"
import { Category } from "../../category/model/category.entity"


@Orm.Entity()
export class Course extends Orm.BaseEntity {

	@Orm.PrimaryGeneratedColumn()
	readonly id: number
	
	@Orm.Column()
	title: string
	
	@Orm.Column()
	description: string
	
	@Orm.Column()
	price: number
	
	@Orm.Column()
	video: string
	
	@Orm.Column()
	poster: string

	@Orm.Column({ default: 0 })
	sold: number

	@Orm.Column({ default: 0, type: "float", scale: 1 })
	rating: number

	@Orm.Column({ default: false })
	discount: boolean

	@Orm.Column({ default: 0 })
	discountPercent: number

	@Orm.Column({ type: "bigint", default: 0 })
	discountDeadline: number

	@Orm.Column({ default: false })
	active: boolean

	@Orm.Column({ default: false })
	saved: boolean

	@Orm.Column({ type: "text", array: true })
	tags: string[]

  @Orm.CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @Orm.UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date

  @Orm.ManyToOne(() => User, entity => entity.courses, {
  	eager: true, cascade: ["update"], onDelete: "CASCADE"
  })
	author: User

  @Orm.ManyToOne(() => Category, entity => entity.courses, {
  	eager: true, cascade: ["update"], onDelete: "CASCADE"
  })
	category: Category

  @Orm.OneToMany(() => Comment, entity => entity.course, {
  	cascade: ["update", "remove"], onDelete: "CASCADE"
  })
	comments: Comment[]

  @Orm.ManyToMany(() => User, entity => entity.purchasedCourses, {
  	cascade: ["update"], onDelete: "CASCADE"
  })
  customers: User[]
}