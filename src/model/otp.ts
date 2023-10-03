import { Optional } from 'sequelize';
import { BelongsToMany, Column, DataType, Model, Table } from 'sequelize-typescript';

export interface IOTPAttributes {
  id: string;
  otp: string;
  expiration_time: string;
  verified: boolean;
}

interface IClassCreationAttributes extends Optional<IOTPAttributes, 'id' | 'verified'> {}

@Table({
  tableName: 'otp',
  timestamps: false,
})
class OTP extends Model<IOTPAttributes, IClassCreationAttributes> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  otp!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  expiration_time!: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
    allowNull: true,
  })
  verified!: boolean;
}

export default OTP;
