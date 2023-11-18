import * as bcrypt from 'bcryptjs';
import { GraphQLError } from 'graphql';
import jwt, { JwtPayload } from 'jsonwebtoken';
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

export const get_user_by_token = async (token: string) => {
  if (!token)
    throw new GraphQLError('Unauthorized user!', {
      extensions: {
        code: 'UNAUTHORIZED',
      },
    });

  const { sub: student_id } = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
  const student = await model.Student.findByPk(student_id);
  if (!student)
    throw new GraphQLError('Student are not available!', {
      extensions: {
        code: 'NOT_FOUND',
      },
    });
  return student;
};

export const sign_in: IHandler<IHandlerForm<FormSignInInput>, AuthToken> = async ({ payload }) => {
  const { email, password } = payload.form;
  if (!email || !password) {
    throw new GraphQLError('Invalid data', {
      extensions: {
        code: 'BAD_REQUEST',
      },
    });
  }

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

export const refresh_token: IHandler<IHandlerForm<FormRefreshTokenInput>, AuthToken> = ({ payload, req }) => {
  const token = req.headers.authorization?.split(' ')[1] as string;
  const { refresh_token } = payload.form;

  if (!refresh_token || !token) {
    throw new GraphQLError('Invalid token data', {
      extensions: {
        code: 'BAD_REQUEST',
      },
    });
  }

  const decodedToken = jwt.verify(refresh_token, env.JWT_REFRESH_SECRET) as jwt.JwtPayload;
  const student_id = decodedToken.sub as string;

  if (
    !refresh_tokens[student_id] ||
    refresh_tokens[student_id].refresh_token !== refresh_token ||
    refresh_tokens[student_id].access_token !== token
  ) {
    throw new GraphQLError('Tokens is not valid!', {
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
  const { email, password, full_name } = payload.form;
  if (!email || !password || !full_name) {
    throw new GraphQLError('invalid data', {
      extensions: {
        code: 'BAD_REQUEST',
      },
    });
  }

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
  const { email, otp } = payload.form;

  if (!email || !otp) {
    throw new GraphQLError('Invalid data', {
      extensions: {
        code: 'BAD_REQUEST',
      },
    });
  }

  const student = await model.Student.findOne({ where: { email } });
  if (!student) {
    throw new GraphQLError('Email is incorrect!', {
      extensions: {
        code: 'NOT_FOUND',
      },
    });
  }

  const otp_record = await model.OTPCode.findOne({
    where: {
      student_email: email,
      expired_at: {
        [Op.gt]: Date.now(),
      },
    },
  });
  if (otp_record === null) {
    throw new GraphQLError('OTP are incorrect!', {
      extensions: {
        code: 'FORBIDDEN',
      },
    });
  }

  const isMatchOtp = await bcrypt.compare(otp, otp_record.code);
  if (!isMatchOtp) {
    throw new GraphQLError('OTP are incorrect!', {
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
  await model.OTPCode.destroy({ where: { student_email: payload.email } });
  const otp_code = otpGenerator.generate(6, { lowerCaseAlphabets: false, specialChars: false });
  const salt = await bcrypt.genSalt(10);
  const hashOtp = await bcrypt.hash(otp_code, salt);
  await model.OTPCode.create({ student_email: payload.email, code: hashOtp });
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

export const change_password: IHandler<IHandlerForm<FormEditPasswordInput>> = async ({ req, payload }) => {
  const token = req.headers.authorization?.split(' ')[1] as string;
  if (!token) {
    throw new GraphQLError('Invalid request!', {
      extensions: {
        code: 'BAD_REQUEST',
      },
    });
  }
  const student = await get_user_by_token(token);

  const { oldPassword, newPassword } = payload.form;
  const oldPasswordMatch = await bcrypt.compare(oldPassword, student.password);
  if (!oldPasswordMatch)
    throw new GraphQLError('Current password is incorrect!', {
      extensions: {
        code: 'UNAUTHORIZED',
      },
    });

  if (oldPassword === newPassword) {
    throw new GraphQLError('The new password must be different from the old password', {
      extensions: {
        code: 'BAD_REQUEST',
      },
    });
  }

  const salt = await bcrypt.genSalt(10);
  const newHashedPassword = await bcrypt.hash(newPassword, salt);
  student.password = newHashedPassword;
  student.save();
  return { message: 'Password has been changed!' };
};
