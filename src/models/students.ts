import { DataTypes, Model, Sequelize } from 'sequelize';

class Student extends Model<StudentModel> {
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
