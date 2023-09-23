import { GraphQLError } from 'graphql';
import models from '~/model';

export const getAllClasses = async () =>
  await models.Class.findAll({
    where: {
      status: 'active',
    },
  });

export const getClassesByStudentId = async (studentId: string) => {
  if (!studentId)
    throw new GraphQLError('Invalid Student ID!', {
      extensions: {
        code: 'BAD_REQUEST',
      },
    });
  const data = await models.Class.findAll({
    include: {
      model: models.Student,
      where: {
        id: studentId,
      },
    },
  });

  if (!data)
    throw new GraphQLError('Student cant found!', {
      extensions: {
        code: 'NOT_FOUND',
      },
    });
  return data;
};

export const getClassDataByPk = async (id: string) => {
  if (!id)
    throw new GraphQLError('Invalid Primary Key!', {
      extensions: {
        code: 'BAD_REQUEST',
      },
    });

  const classData = await models.Class.findByPk(id, {
    include: models.Student,
  });

  if (!classData)
    throw new GraphQLError('Cant found the class!', {
      extensions: {
        code: 'NOT_FOUND',
      },
    });
  return classData;
};

export const createClass = async (name: string) => {
  if (!name)
    throw new GraphQLError('Invalid class name', {
      extensions: {
        code: 'BAD_REQUEST',
      },
    });

  const exitsClass = await models.Class.findOne({ where: { className: name } });
  if (exitsClass)
    throw new GraphQLError('Class is already exists!', {
      extensions: {
        code: 'CONFLICT',
      },
    });
  return await models.Class.create({ className: name }, { validate: true });
};

export const updateClassNameById = async (id: string, name: string) => {
  if (!id || !name)
    throw new GraphQLError('Invalid Input!', {
      extensions: {
        code: 'BAD_REQUEST',
      },
    });

  const targetClass = await models.Class.findByPk(id);
  if (!targetClass)
    throw new GraphQLError('Class cant found!', {
      extensions: {
        code: 'NOT_FOUND',
      },
    });

  targetClass.class_name = name;
  const updatedClass = await targetClass.save();
  return updatedClass;
};
