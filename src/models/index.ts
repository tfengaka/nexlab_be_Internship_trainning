import { Dialect, Sequelize } from 'sequelize';

import env from '~/config/env';
import StudentModel from './students';
import ClassModel from './classes';
import EnrollmentsModel from './enrollments';

const dbName = env.DB_NAME as string;
const dbUser = env.DB_USER as string;
const dbPassword = env.DB_PASSWORD as string;
const dbHost = env.DB_HOST;
const dbDialect = env.DB_DIALECT as Dialect;

export const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: dbDialect,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

const Student = StudentModel(sequelize);
const Class = ClassModel(sequelize);
const Enrollment = EnrollmentsModel(sequelize);

Student.belongsToMany(Class, {
  through: Enrollment,
});
Class.belongsToMany(Student, {
  through: Enrollment,
});

export const connectDatabase = async () => {
  await sequelize.authenticate();
};
export default { Student, Class, Enrollment };
