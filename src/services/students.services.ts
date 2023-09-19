import models from '~/models';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import env from '~/config/env';
import { GraphQLError } from 'graphql';

export const SignUp = async ({ email, password, fullName }: SignUpInput): Promise<AuthOutput> => {
  const isAlready = await models.Student.findOne({ where: { email: email } });
  if (isAlready) {
    throw new GraphQLError('Email Has Already!');
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newStudent = await models.Student.create({
    email,
    password: hashedPassword,
    fullName,
  });
  const accessToken = jwt.sign({ id: newStudent.id }, env.JWT_SECRET, {
    expiresIn: '24h',
  });
  return {
    code: 200,
    message: '',
    data: {
      student: newStudent,
      accessToken,
    },
  };
};

export const SignIn = async ({ email, password }: SignInInput) => {
  const student = await models.Student.findOne({ where: { email } });
  if (!student) return { message: 'Email or password are incorrect!' };
  const matchPassword = await bcrypt.compare(password, student.password);
  if (!matchPassword) throw new GraphQLError('Email or password are incorrect!');

  const accessToken = jwt.sign({ id: student.id }, env.JWT_SECRET, {
    expiresIn: '24h',
  });

  return { accessToken };
};
