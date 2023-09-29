import dotenv from 'dotenv';
dotenv.config();

const NODE_ENV = process.env.NODE_ENV ? (process.env.NODE_ENV as NodeEnv) : 'development';
const env = {
  NODE_ENV,
  JWT_SECRET: process.env.JWT_SECRET as string,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
  PORT: Number(process.env.PORT),
  DB_HOST: process.env.POSTGRES_HOST || 'localhost',
  DB_NAME: process.env.POSTGRES_DB_NAME,
  DB_USER: process.env.POSTGRES_USER,
  DB_PASSWORD: process.env.POSTGRES_PASSWORD,
};

export default env;
