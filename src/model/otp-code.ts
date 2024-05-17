import { Optional } from 'sequelize';
import { BelongsTo, Column, CreatedAt, DataType, ForeignKey, Model, Table, UpdatedAt } from 'sequelize-typescript';
import User from './user';

export interface IOTPAttributes {
  id: string;
  email: string;
  code: string;
  expired_at: string;
}
interface IOTPCreationAttributes extends Optional<IOTPAttributes, 'id' | 'expired_at'> {}

@Table({ tableName: 'otp_logs' })
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

  @Column
  @ForeignKey(() => User)
  email!: string;

  @BelongsTo(() => User, {
    foreignKey: 'otp_user_fk',
    targetKey: 'email',
  })
  student!: User;
}
