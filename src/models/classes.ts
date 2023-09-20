import { DataTypes, Model, Sequelize } from 'sequelize';

class Class extends Model<ClassModel> {
  declare id: string;
  declare className: string;
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
    },
    {
      sequelize,
      modelName: 'classes',
    }
  );
