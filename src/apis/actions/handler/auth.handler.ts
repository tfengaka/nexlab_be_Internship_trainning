import * as bcrypt from 'bcryptjs';
import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken';
import otpGenerator from 'otp-generator';
import { Op } from 'sequelize';

import { IHandler, IHandlerForm } from '~/apis/types';
import env from '~/config/env';
import model from '~/model';
import { otp_email_template, sendMail } from '~/utils';

const refresh_tokens: Record<string, AuthToken> = {};

const generate_token = (id: string, secret_key: string, expiresIn?: number | string) =>
  jwt.sign({ sub: id }, secret_key, {
    expiresIn: expiresIn,
  });

export const sign_in: IHandler<IHandlerForm<FormSignInInput>, AuthToken> = async ({ payload }) => {
  if (!payload.form) {
    throw new GraphQLError('Invalid Input', {
      extensions: {
        code: 'BAD_REQUEST',
      },
    });
  }
  const { email, password } = payload.form;

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
  if (student.status === 'pending' || student.verified_at === null) {
    throw new GraphQLError('Your account is not verified yet!', {
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

export const refresh_token: IHandler<IHandlerForm<FormRefreshTokenInput>, AuthToken> = ({ payload }) => {
  if (!payload.form) {
    throw new GraphQLError('Invalid Input', {
      extensions: {
        code: 'BAD_REQUEST',
      },
    });
  }
  const { refresh_token } = payload.form;

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

export const sign_up: IHandler<IHandlerForm<FormSignUpInput>> = async ({ payload }) => {
  if (!payload.form) {
    throw new GraphQLError('Invalid Input', {
      extensions: {
        code: 'BAD_REQUEST',
      },
    });
  }
  const { email, password, full_name } = payload.form;
  const is_already = await model.Student.findOne({ where: { email } });
  if (is_already) {
    throw new GraphQLError('Student already exits!', {
      extensions: {
        code: 'CONFLICT',
      },
    });
  }
  const salt = bcrypt.genSaltSync(10);
  const hash_Password = bcrypt.hashSync(password, salt);
  const student = await model.Student.create({ email, password: hash_Password, full_name, status: 'pending' });

  return { email: student.email, full_name: student.full_name };
};

export const otp_verify: IHandler<IHandlerForm<FormOTPVerifyInput>> = async ({ payload }) => {
  if (!payload.form) {
    throw new GraphQLError('Invalid Input', {
      extensions: {
        code: 'BAD_REQUEST',
      },
    });
  }
  const { email, otp } = payload.form;

  const otp_record = await model.OTP_Code.findOne({
    where: {
      student_email: email,
      code: otp,
      expired_at: {
        [Op.gt]: Date.now(),
      },
    },
  });

  if (otp_record === null) {
    throw new GraphQLError('OTP is not valid!', {
      extensions: {
        code: 'FORBIDDEN',
      },
    });
  }

  const student = await model.Student.findOne({ where: { email } });
  if (!student) {
    throw new GraphQLError('Email is incorrect!', {
      extensions: {
        code: 'FORBIDDEN',
      },
    });
  }
  student.status = 'active';
  student.verified_at = new Date();
  student.save();

  return { message: `Email (${email}) has been verified!` };
};

export const resend_otp: IHandler<{ email: string }> = async ({ payload }) => {
  const account = await model.Student.findOne({ where: { email: payload.email } });
  if (!account) {
    throw new GraphQLError('Email is incorrect!', {
      extensions: {
        code: 'FORBIDDEN',
      },
    });
  }
  if (account.status === 'active' && account.verified_at !== null) {
    return {
      message: 'This account has been verified!',
    };
  }
  await model.OTP_Code.destroy({ where: { student_email: payload.email } });
  const otp_code = otpGenerator.generate(6, { lowerCaseAlphabets: false, specialChars: false });
  await model.OTP_Code.create({ student_email: payload.email, code: otp_code });
  const mailBody = {
    to: payload.email,
    subject: 'Verification Email',
    html: otp_email_template(account.full_name, otp_code),
  };
  const mailResponse = await sendMail(mailBody);
  return {
    message: `Sent to ${mailResponse.envelope.to}`,
  };
};
