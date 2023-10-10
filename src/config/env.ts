import dotenv from 'dotenv';
dotenv.config();

const env = {
  // App
  NODE_ENV: process.env.NODE_ENV ? (process.env.NODE_ENV as NodeEnv) : 'development',
  HOST: process.env.HOST,
  JWT_SECRET: process.env.JWT_SECRET as string,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
  PORT: Number(process.env.PORT),

  // PostgreSQL
  DB_HOST: process.env.POSTGRES_HOST || 'localhost',
  DB_NAME: process.env.POSTGRES_DB_NAME,
  DB_USER: process.env.POSTGRES_USER,
  DB_PASSWORD: process.env.POSTGRES_PASSWORD,

  // Nodemailer
  MAIL_HOST: process.env.MAIL_HOST,
  MAIL_USERNAME: process.env.MAIL_USERNAME,
  MAIL_PASSWORD: process.env.MAIL_PASSWORD,
  MAIL_FROM_ADDRESS: process.env.MAIL_FROM_ADDRESS as string,
  MAIL_FROM_NAME: process.env.MAIL_FROM_NAME as string,

  // Firebase
  FIREBASE_API_KEY: process.env.FIREBASE_API_KEY as string,
  FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN as string,
  FIREBASE_PROJ_ID: process.env.FIREBASE_PROJ_ID as string,
  FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET as string,
  FIREBASE_SENDER_ID: process.env.FIREBASE_SENDER_ID as string,
  FIREBASE_APP_ID: process.env.FIREBASE_APP_ID as string,
  FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID as string,
};

export default env;
