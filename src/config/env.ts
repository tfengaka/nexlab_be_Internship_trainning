import dotenv from 'dotenv';
dotenv.config();

const NODE_ENV = process.env.NODE_ENV ? (process.env.NODE_ENV as NodeEnv) : 'development';
const env = {
  NODE_ENV,
  JWT_SECRET: process.env.JWT_SECRET || 'jwtSecret',
  PORT: Number(process.env.PORT) || 3000,
  DB_NAME: process.env.DB_NAME || 'postgres',
  DB_URL: process.env.DB_URL,
};

export default env;
