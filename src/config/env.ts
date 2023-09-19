import dotenv from 'dotenv';
dotenv.config();

const NODE_ENV = process.env.NODE_ENV
  ? (process.env.NODE_ENV as 'development' | 'production' | 'staging')
  : 'development';

const env = {
  NODE_ENV,
  JWT_SECRET: process.env.JWT_SECRET || 'jwtSecret',
  PORT: Number(process.env.PORT) || 3000,
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_HOST: process.env.DB_HOST,
  DB_DIALECT: process.env.DB_DIALECT,
};

export default env;
