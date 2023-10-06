import { GraphQLError } from 'graphql';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { IHandler } from '~/apis/types';
import env from '~/config/env';
import model from '~/model';

export const enroll_class: IHandler<{ class_id: string }> = async ({ req, payload: { class_id } }) => {
  const token = req.headers.authorization?.split(' ')[1] as string;
  if (!token || !class_id) {
    throw new GraphQLError('Invalid request!', {
      extensions: {
        code: 'BAD_REQUEST',
      },
    });
  }

  const _class = await model.Class.findByPk(class_id);
  if (!_class || _class.status !== 'active') {
    throw new GraphQLError('Class are not available!', {
      extensions: {
        code: 'FORBIDDEN',
      },
    });
  }

  const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
  const student_id = decoded.sub as string;

  const _isRegistered = await model.Enrollment.findOne({ where: { student_id, class_id } });
  if (_isRegistered) {
    throw new GraphQLError('You are already enrolled in this class!', {
      extensions: {
        code: 'FORBIDDEN',
      },
    });
  }
  await model.Enrollment.create({ student_id, class_id });
  return { message: `Enrollment for ${_class.class_name} successfully!` };
};
