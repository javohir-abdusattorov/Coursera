
import * as Orm from "typeorm"
import { LogType } from "./log.type"
import { User } from "../../user/model/user.entity"


@Orm.Entity()
export class Logger extends Orm.BaseEntity {

	@Orm.PrimaryGeneratedColumn()
	readonly id: number

  @Orm.Column({
    type: "jsonb",
    nullable: true,
  })
  logs: LogType[]

  @Orm.CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @Orm.UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date

  @Orm.OneToOne(() => User, {
  	eager: true, cascade: ["update"], onDelete: "CASCADE"
  })
  @Orm.JoinColumn()
	user: User
}