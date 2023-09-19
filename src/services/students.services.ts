import bcrypt from 'bcrypt';
import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken';

import env from '~/config/env';
import models from '~/models';

export const SignUp = async ({ email, password, fullName }: SignUpInput): Promise<AuthOutput> => {
  if (!email || !password || !fullName)
    throw new GraphQLError('Invalid Input!', {
      extensions: {
        code: 'BAD_REQUEST',
      },
    });

  const isAlready = await models.Student.findOne({ where: { email: email } });
  if (isAlready)
    throw new GraphQLError('Student has already!', {
      extensions: {
        code: 'CONFLICT',
      },
    });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const student = await models.Student.create({
    email,
    password: hashedPassword,
    fullName,
  });

  const accessToken = jwt.sign({ sub: student.id }, env.JWT_SECRET, {
    expiresIn: '24h',
  });

  return {
    student,
    accessToken,
  };
};

export const SignIn = async ({ email, password }: SignInInput): Promise<AuthOutput> => {
  if (!email || !password)
    throw new GraphQLError('Invalid Input!', {
      extensions: {
        code: 'BAD_REQUEST',
      },
    });

  const student = await models.Student.findOne({ where: { email } });
  if (!student)
    throw new GraphQLError('Email or password are incorrect!', {
      extensions: {
        code: 'BAD_REQUEST',
      },
    });

  const matchPassword = await bcrypt.compare(password, student.password);
  if (!matchPassword)
    throw new GraphQLError('Email or password are incorrect!', {
      extensions: {
        code: 'BAD_REQUEST',
      },
    });

  const accessToken = jwt.sign({ sub: student.id }, env.JWT_SECRET, {
    expiresIn: '24h',
  });

  return {
    accessToken,
    student,
  };
};

export const getCurrentStudent = async (token: string) => {
  if (!token)
    throw new GraphQLError('Invalid Token!', {
      extensions: {
        code: 'UNAUTHORIZED',
      },
    });
  let studentId = '';
  jwt.verify(token, env.JWT_SECRET, (err, decoded) => {
    if (err)
      throw new GraphQLError(err.message, {
        extensions: {
          code: err.name.toUpperCase(),
        },
      });
    if (typeof decoded !== 'string') {
      studentId = decoded?.sub as string;
    }
  });
  const student = await models.Student.findByPk(studentId);
  if (!student)
    throw new GraphQLError('Student not found!', {
      extensions: {
        code: 'NOT_FOUND',
      },
    });

  return student;
};

export const getAllStudents = async () => {
  return await models.Student.findAll();
};

export const removeStudentByPk = async (id: string) => {
  const student = await models.Student.findByPk(id);
  if (!student)
    throw new GraphQLError('Student not found!', {
      extensions: {
        code: 'NOT_FOUND',
      },
    });

  const name = student.fullName;
  await student.destroy();

  return {
    messages: `Student ${name} has been removed!`,
  };
};

export const updateStudentDataByPk = async (id: string, data: UpdateStudentInput) => {
  const student = await models.Student.findByPk(id);
  if (!student)
    throw new GraphQLError('Student not found!', {
      extensions: {
        code: 'NOT_FOUND',
      },
    });

  student.fullName = data.fullName;
  student.email = data.email;

  student.save();

  return student;
};

export const changePassword = async (token: string, form: ChangePasswordInput) => {
  const student = await getCurrentStudent(token);
  const oldPasswordMatch = await bcrypt.compare(form.oldPassword, student.password);
  if (!oldPasswordMatch)
    throw new GraphQLError('Current password is incorrect!', {
      extensions: {
        code: 'UNAUTHORIZED',
      },
    });

  const salt = await bcrypt.genSalt(10);
  const newHashedPassword = await bcrypt.hash(form.newPassword, salt);
  student.password = newHashedPassword;
  student.save();
  return {
    messages: 'Password has been changed!',
  };
};
