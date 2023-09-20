import { DataTypes, Model, Sequelize } from 'sequelize';

class Enrollment extends Model {
  public declare studentId: string;
  public declare classId: string;
  public declare status: string;
}

export default (sequelize: Sequelize) =>
  Enrollment.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      studentId: {
        allowNull: true,
        type: DataTypes.UUID,
      },
      classId: {
        allowNull: true,
        type: DataTypes.UUID,
      },
      status: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: 'active',
      },
    },
    {
      sequelize,
      tableName: 'enrollments',
    }
  );
