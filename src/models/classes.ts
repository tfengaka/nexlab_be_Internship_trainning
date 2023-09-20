import { DataTypes, Model, Sequelize } from 'sequelize';

class Class extends Model<ClassModel> {
  declare id: string;
  declare className: string;
  declare status: string;
}

export default (sequelize: Sequelize) =>
  Class.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      className: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
      },
      status: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: 'active',
      },
    },
    {
      sequelize,
      modelName: 'classes',
    }
  );
