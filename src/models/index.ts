import { Dialect, Sequelize } from 'sequelize';

import env from '~/config/env';
import StudentModel from './students';
import ClassModel from './classes';
import EnrollmentsModel from './enrollments';

const connectURL = env.DB_URL || `postgres://postgres:postgres@127.0.0.1:5432/${env.DB_NAME}`;
export const sequelize = new Sequelize(connectURL, {
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
