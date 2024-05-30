import { Optional } from 'sequelize';
import { BelongsTo, Column, CreatedAt, DataType, ForeignKey, Model, Table, UpdatedAt } from 'sequelize-typescript';
import User from './user';

export interface ITaskAttributes {
  id: string;
  title: string;
  description: string;
  images: Array<string>;
  is_completed: boolean;
  status: Status;
  order: number;
}
interface ITaskCreation extends Optional<ITaskAttributes, 'id' | 'status' | 'order'> {}

@Table({ tableName: 'tasks' })
class Task extends Model<ITaskAttributes, ITaskCreation> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id!: string;

  @Column({ type: DataType.TEXT })
  title!: string;

  @Column({ type: DataType.TEXT })
  descriptions!: string;

  @Column({ type: DataType.JSONB })
  images!: Array<string>;

  @Column({ type: DataType.BOOLEAN })
  is_completed!: boolean;

  @Column({ type: DataType.INTEGER })
  order!: number;

  @Column({ type: DataType.STRING })
  status!: Status;

  @CreatedAt
  created_at!: Date;

  @UpdatedAt
  updated_at!: Date;

  @Column({ type: DataType.UUID })
  @ForeignKey(() => User)
  assignee_id!: string;

  @BelongsTo(() => User)
  assignee!: User;
}

export default Task;
