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
          attributes: {
            include: ['id', 'class_name'],
          },
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
