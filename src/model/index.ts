import { Sequelize } from 'sequelize-typescript';
import env from '~/config/env';
import Student from './student';
import Class from './class';
import Enrollment from './enrollment';
import OTPCode from './otp_code';
import EventLog from './event-log';

export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: env.DB_HOST,
  database: env.DB_NAME,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  models: [Student, Class, Enrollment, OTPCode, EventLog],
});

export const connectDatabase = async () => {
  await sequelize.authenticate();
};

export default { Student, Class, Enrollment, OTPCode, EventLog };
