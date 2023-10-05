import { GraphQLError } from 'graphql';
import otpGenerator from 'otp-generator';
import { IHandler } from '~/apis/types';
import model from '~/model';
import { IStudentAttributes } from '~/model/student';
import { otp_email_template, sendMail } from '~/utils';

export const send_otp: IHandler<{ new: IStudentAttributes }> = async ({ payload }) => {
  const { email, full_name } = payload.new;
  console.log('Sending OTP');
  const account = await model.Student.findOne({ where: { email } });
  if (!account) {
    throw new GraphQLError('Cant found account for this email!', {
      extensions: {
        code: 'FORBIDDEN',
      },
    });
  }
  const otp_code = otpGenerator.generate(8, { lowerCaseAlphabets: false, specialChars: false });
  await model.OTP_Code.create({ student_email: email, code: otp_code });
  const mailBody = {
    to: email,
    subject: 'Verification Email',
    html: otp_email_template(full_name, otp_code),
  };
  const mailResponse = await sendMail(mailBody);
  return mailResponse;
};
