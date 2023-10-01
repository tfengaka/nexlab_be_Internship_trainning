import bcrypt from 'bcrypt';
import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken';

import env from '~/config/env';
import models from '~/model';


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
