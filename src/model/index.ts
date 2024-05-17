import { Sequelize } from 'sequelize-typescript';
import env from '~/config/env';
import OTPCode from './otp-code';
import User from './user';

export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: env.DB_HOST,
  database: env.DB_NAME,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  models: [User, OTPCode],
});

export const connectDatabase = async () => {
  await sequelize.authenticate();
};

export default { User,  OTPCode };
