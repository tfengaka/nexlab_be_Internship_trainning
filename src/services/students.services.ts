import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import env from '~/config/env';
import models from '~/models';

import { GraphQLError } from 'graphql';

export const SignUp = async ({ email, password, fullName }: SignUpInput): Promise<AuthOutput> => {
  if (!email || !password || !fullName) throw new GraphQLError('Invalid Form Data!');

  const isAlready = await models.Student.findOne({ where: { email: email } });
  if (isAlready) throw new GraphQLError('Student has already!');

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const student = await models.Student.create({
    email,
    password: hashedPassword,
    fullName,
  });
  const accessToken = jwt.sign({ id: student.id }, env.JWT_SECRET, {
    expiresIn: '24h',
  });
  return {
    student,
    accessToken,
  };
};

export const SignIn = async ({ email, password }: SignInInput): Promise<AuthOutput> => {
  if (!email || !password) throw new GraphQLError('Invalid Input!');

  const student = await models.Student.findOne({ where: { email } });
  if (!student) throw new GraphQLError('Email or password are incorrect!');

  const matchPassword = await bcrypt.compare(password, student.password);
  if (!matchPassword) throw new GraphQLError('Email or password are incorrect!');

  const accessToken = jwt.sign({ id: student.id }, env.JWT_SECRET, {
    expiresIn: '24h',
  });

  return {
    accessToken,
    student,
  };
};

export const getCurrentStudent = async (token: string): Promise<StudentData> => {
  if (!token) throw new GraphQLError('Invalid Token!');
  const tokenDecoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
  const student = await models.Student.findByPk(tokenDecoded.id);
  if (!student) throw new GraphQLError('Could not find student!');
  return student;
};
