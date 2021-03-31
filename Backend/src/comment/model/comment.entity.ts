
import * as Orm from "typeorm"
import { User } from "../../user/model/user.entity"
import { Course } from "../../course/model/course.entity"


@Orm.Entity()
export class Comment extends Orm.BaseEntity {

	@Orm.PrimaryGeneratedColumn()
	readonly id: number
	
	@Orm.Column()
	message: string

  @Orm.CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @Orm.UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date

  @Orm.ManyToOne(() => User, entity => entity.comments, {
  	cascade: ["update"], onDelete: "CASCADE"
  })
	user: User

  @Orm.ManyToOne(() => Course, entity => entity.comments, {
  	cascade: ["update"], onDelete: "CASCADE"
  })
	course: Course
}