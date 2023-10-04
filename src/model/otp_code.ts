import { Optional } from 'sequelize';
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import Student from './student';

export interface IOTPAttributes {
  id: string;
  student_email: string;
  code: string;
  expired_at: string;
}

interface IOTPCreationAttributes extends Optional<IOTPAttributes, 'id' | 'expired_at'> {}

@Table({
  tableName: 'otp_code',
  timestamps: false,
})
export default class OTP_Code extends Model<IOTPAttributes, IOTPCreationAttributes> {
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

  @ForeignKey(() => Student)
  @Column
  student_email!: string;

  @BelongsTo(() => Student, {
    foreignKey: 'student_email',
    targetKey: 'email',
  })
  student!: Student;
}
