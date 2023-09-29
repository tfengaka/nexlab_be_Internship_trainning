import bcrypt from 'bcrypt';
import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken';

import env from '~/config/env';
import models from '~/model';

export const SignUp = async ({ email, password, full_name }: FormSignUpInput) => {
  if (!email || !password || !full_name)
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
    full_name,
  });

  const access_token = jwt.sign({ sub: student.id }, env.JWT_SECRET, {
    expiresIn: '24h',
  });

  return {
    access_token,
  };
};

export const SignIn = async ({ email, password }: FormSignInInput) => {
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

  const access_token = jwt.sign({ sub: student.id }, env.JWT_SECRET, {
    expiresIn: '24h',
  });

  return {
    access_token,
  };
};

export const getCurrentStudent = async (token: string, hasClasses: boolean = true) => {
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

  const student = hasClasses
    ? await models.Student.findByPk(studentId, {
        include: {
          model: models.Class,
        },
      })
    : await models.Student.findByPk(studentId);
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
  if (!id)
    throw new GraphQLError('Invalid ID!', {
      extensions: {
        code: 'BAD_REQUEST',
      },
    });

  const student = await models.Student.findByPk(id);
  if (!student)
    throw new GraphQLError('Student not found!', {
      extensions: {
        code: 'NOT_FOUND',
      },
    });

  const name = student.full_name;
  await student.destroy();

  return {
    messages: `Student ${name} has been removed!`,
  };
};

export const updateStudentDataByPk = async (id: string, data: FormUpdateStudent) => {
  const student = await models.Student.findByPk(id);
  if (!student)
    throw new GraphQLError('Student not found!', {
      extensions: {
        code: 'NOT_FOUND',
      },
    });

  student.full_name = data.full_name;
  student.email = data.email;

  student.save();

  return student;
};

export const changePassword = async (token: string, form: FormEditPasswordInput) => {
  const student = await getCurrentStudent(token, false);
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

export const enrollClass = async (token: string, classId: string) => {
  const student = await getCurrentStudent(token, false);
  if (!classId)
    throw new GraphQLError('Invalid ClassID!', {
      extensions: {
        code: 'BAD_REQUEST',
      },
    });
  const classData = await models.Class.findByPk(classId);
  if (classData === null || classData.status !== 'active')
    throw new GraphQLError('This class is not available for registration!', {
      extensions: {
        code: 'FORBIDDEN',
      },
    });

  const enrollment = await models.Enrollment.create({ student_id: student.id, class_id: classId });
  if (!enrollment)
    throw new GraphQLError(`There was an error during the registration process for ${classData.class_name} class`, {
      extensions: {
        code: 'INTERNAL_SERVER_ERROR',
      },
    });
  return { messages: `Registration for ${classData.class_name} class is successful!` };
};
