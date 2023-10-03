import { Optional } from 'sequelize';
import { BelongsToMany, Column, DataType, Model, Table } from 'sequelize-typescript';
import Student from './student';
import Enrollment from './enrollment';

export interface IClassAttributes {
  id: string;
  class_name: string;
  status: Status;
}
interface IClassCreationAttributes extends Optional<IClassAttributes, 'id' | 'status'> {}

@Table({
  tableName: 'class',
  timestamps: false,
})
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

  @BelongsToMany(() => Student, () => Enrollment)
  student_enrollment!: Student[];
}

export default Class;
