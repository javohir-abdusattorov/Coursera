
import * as Orm from "typeorm"
import { Course } from "../../course/model/course.entity"


@Orm.Entity()
@Orm.Unique(["name"])
export class Category extends Orm.BaseEntity {

	@Orm.PrimaryGeneratedColumn()
	readonly id: number

	@Orm.Column({ unique: true })
	name: string

  @Orm.OneToMany(() => Course, entity => entity.category, {
  	cascade: ["update"], onDelete: "CASCADE"
  })
	courses: Course[]

  @Orm.CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @Orm.UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date
}