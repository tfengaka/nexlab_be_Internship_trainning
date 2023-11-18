import { Optional } from 'sequelize';
import { BelongsTo, Column, CreatedAt, DataType, ForeignKey, Model, Table, UpdatedAt } from 'sequelize-typescript';
import Student from './student';

export interface IOTPAttributes {
  id: string;
  student_email: string;
  code: string;
  expired_at: string;
}
interface IOTPCreationAttributes extends Optional<IOTPAttributes, 'id' | 'expired_at'> {}

@Table({ tableName: 'otp_code' })
export default class OTPCode extends Model<IOTPAttributes, IOTPCreationAttributes> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  code!: string;

  @Column({
    type: DataType.DATE,
  })
  expired_at!: string;

  @CreatedAt
  created_at!: Date;

  @UpdatedAt
  updated_at!: Date;

  @ForeignKey(() => Student)
  @Column
  student_email!: string;

  @BelongsTo(() => Student, {
    foreignKey: 'student_email',
    targetKey: 'email',
  })
  student!: Student;
}
