import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken';
import env from '~/config/env';
import models from '~/model';

export const getCurrentUser = async (token: string) => {
  if (!token)
    throw new GraphQLError('Invalid Token!', {
      extensions: {
        code: 'UNAUTHORIZED',
      },
    });

  let userId = '';
  jwt.verify(token, env.JWT_SECRET, (err, decoded) => {
    if (err)
      throw new GraphQLError(err.message, {
        extensions: { code: err.name.toUpperCase() },
      });
    if (typeof decoded !== 'string') {
      userId = decoded?.sub as string;
    }
  });

  const user = await models.User.findByPk(userId, {
    include: [{ model: models.Task, as: 'tasks' }],
  });
  if (!user)
    throw new GraphQLError('User not found!', {
      extensions: { code: 'NOT_FOUND' },
    });
  return user;
};
