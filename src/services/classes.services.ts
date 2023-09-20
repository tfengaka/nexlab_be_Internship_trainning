import { GraphQLError } from 'graphql';
import models from '~/models';

export const getAllClasses = async () => await models.Class.findAll();

export const createClass = async (name: string) => {
  if (!name)
    throw new GraphQLError('Invalid class name', {
      extensions: {
        code: 'BAD_REQUEST',
      },
    });
};
