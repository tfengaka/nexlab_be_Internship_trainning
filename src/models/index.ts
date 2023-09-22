import { Sequelize } from 'sequelize';

import env from '~/config/env';
import ClassModel from './classes';
import EnrollmentsModel from './enrollments';
import StudentModel from './students';

export const sequelize = new Sequelize(env.DB_URL as string, {
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
