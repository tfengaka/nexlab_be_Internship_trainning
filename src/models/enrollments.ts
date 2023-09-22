import { DataTypes, Model, Sequelize } from 'sequelize';

interface EnrollmentModel {
  id?: number | string;
  studentId: string;
  classId: string;
  status?: Status;
}

class Enrollment extends Model<EnrollmentModel> {
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
