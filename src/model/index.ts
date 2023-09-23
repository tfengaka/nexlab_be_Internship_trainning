import { Sequelize } from 'sequelize-typescript';
import env from '~/config/env';
import Student from './student';
import Class from './class';
import Enrollment from './enrollment';

export const sequelize = new Sequelize({
  database: env.DB_NAME,
  dialect: 'postgres',
  host: env.DB_HOST,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  models: [Student, Class, Enrollment],
});

export const connectDatabase = async () => {
  await sequelize.authenticate();
};

export default { Student, Class, Enrollment };
