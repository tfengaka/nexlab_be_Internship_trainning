import { Optional } from 'sequelize';
import { BelongsToMany, Column, DataType, Model, Table } from 'sequelize-typescript';
import Class from './class';
import Enrollment from './enrollment';

interface IStudentAttributes {
  id: string;
  full_name: string;
  email: string;
  password: string;
  status: Status;
}
interface IStudentCreationAttributes extends Optional<IStudentAttributes, 'id' | 'status'> {}

/*
class Student extends Model<IStudent> {
  declare id: string;
  declare fullName: string;
  declare email: string;
  declare password: string;
  declare status: string;
}

export default (sequelize: Sequelize) =>
  Student.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      fullName: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      email: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: {
            msg: 'Please enter a valid email address!',
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: 'active',
      },
    },
    {
      sequelize,
      modelName: 'students',
    }
  );
 */

@Table({
  tableName: 'student',
  timestamps: true,
})
class Student extends Model<IStudentAttributes, IStudentCreationAttributes> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id!: string;

  @Column({
    type: DataType.TEXT,
    unique: true,
    validate: {
      isEmail: {
        msg: 'Please enter a valid email address!',
      },
    },
  })
  email!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  full_name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string;

  @Column({
    type: DataType.STRING,
    defaultValue: 'active',
    allowNull: false,
  })
  status!: string;

  @BelongsToMany(() => Class, () => Enrollment)
  class_enrollment!: Class[];
}

export default Student;
