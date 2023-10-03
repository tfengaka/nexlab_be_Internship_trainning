import bcrypt from 'bcrypt';
import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken';
import { IHandler } from '~/apis/types';
import env from '~/config/env';
import model from '~/model';

const refresh_tokens: Record<string, AuthToken> = {};

const generate_token = (id: string, secret_key: string, expiresIn?: number | string) =>
  jwt.sign({ sub: id }, secret_key, {
    expiresIn: expiresIn,
  });

export const sign_in: IHandler<{ form: FormSignInInput }, AuthToken> = async ({ data }) => {
  if (!data.form) {
    throw new GraphQLError('Invalid Input', {
      extensions: {
        code: 'BAD_REQUEST',
      },
    });
  }
  const { email, password } = data.form;

  const student = await model.Student.findOne({ where: { email } });
  if (!student) {
    throw new GraphQLError('Email or password are incorrect!', {
      extensions: {
        code: 'FORBIDDEN',
      },
    });
  }

  const isMatchPassword = await bcrypt.compare(password, student.password);
  if (!isMatchPassword) {
    throw new GraphQLError('Email or password are incorrect!', {
      extensions: {
        code: 'FORBIDDEN',
      },
    });
  }

  const access_token = generate_token(student.id, env.JWT_SECRET, '1h');
  const refresh_token = generate_token(student.id, env.JWT_REFRESH_SECRET, '30d');
  const res = { access_token, refresh_token };
  refresh_tokens[student.id] = res;

  return res;
};
export const sign_up: IHandler<{ form: FormSignUpInput }, AuthToken> = async ({ data }) => {
  if (!data.form) {
    throw new GraphQLError('Invalid Input', {
      extensions: {
        code: 'BAD_REQUEST',
      },
    });
  }
  const { email, password, full_name } = data.form;

  const is_already = await model.Student.findOne({ where: { email } });
  if (is_already) {
    throw new GraphQLError('Student already exits!', {
      extensions: {
        code: 'CONFLICT',
      },
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hash_Password = await bcrypt.hash(password, salt);
  const student = await model.Student.create({ email, password: hash_Password, full_name });

  const access_token = generate_token(student.id, env.JWT_SECRET, '1h');
  const refresh_token = generate_token(student.id, env.JWT_REFRESH_SECRET, '30d');
  const res = { access_token, refresh_token };
  refresh_tokens[student.id] = res;

  return res;
};
export const refresh_token: IHandler<{ form: FormRefreshTokenInput }, AuthToken> = ({ data }) => {
  if (!data.form) {
    throw new GraphQLError('Invalid Input', {
      extensions: {
        code: 'BAD_REQUEST',
      },
    });
  }
  const { refresh_token } = data.form;

  if (!refresh_token) {
    throw new GraphQLError('You are not authenticated!', {
      extensions: {
        code: 'UNAUTHENTICATED',
      },
    });
  }

  const decodedToken = jwt.verify(refresh_token, env.JWT_REFRESH_SECRET) as jwt.JwtPayload;
  const student_id = decodedToken.sub as string;

  if (!refresh_tokens[student_id] || refresh_tokens[student_id].refresh_token !== refresh_token) {
    throw new GraphQLError('Refresh token is not valid!', {
      extensions: {
        code: 'FORBIDDEN',
      },
    });
  }

  const new_access_token = generate_token(student_id, env.JWT_SECRET, '1h');
  const new_refresh_token = generate_token(student_id, env.JWT_REFRESH_SECRET, '30d');
  const res = { access_token: new_access_token, refresh_token: new_refresh_token };
  refresh_tokens[student_id] = res;
  return res;
};
export const otp_verify = () => {
  throw new GraphQLError('Not Implemented', {
    extensions: {
      code: 'NOT_IMPLEMENTED',
    },
  });
};
