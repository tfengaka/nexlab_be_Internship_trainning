import { Optional } from 'sequelize';
import { BelongsToMany, Column, CreatedAt, DataType, Model, Table, UpdatedAt } from 'sequelize-typescript';
import Enrollment from './enrollment';
import Student from './student';

export interface IClassAttributes {
  id: string;
  class_name: string;
  status: Status;
}
interface IClassCreationAttributes extends Optional<IClassAttributes, 'id' | 'status'> {}

@Table({ tableName: 'class' })
class Class extends Model<IClassAttributes, IClassCreationAttributes> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    unique: true,
  })
  class_name!: string;

  @Column({
    type: DataType.STRING,
    defaultValue: 'active',
    allowNull: false,
  })
  status!: string;

  @CreatedAt
  created_at!: Date;

  @UpdatedAt
  updated_at!: Date;

  @BelongsToMany(() => Student, () => Enrollment)
  student_enrollment!: Student[];
}

export default Class;
