import { IHandler } from '~/apis/types';
import { IStudentAttributes } from '~/model/student';
import { sendMail } from '~/utils';

export const send_otp: IHandler<{ new: IStudentAttributes }> = async ({ res, payload }) => {
  try {
    const { email, full_name } = payload.new;
    const mailBody = {
      to: email,
      subject: 'Verify your email',
      html: `<h1>Hello ${full_name}</h1>
      <p><b>123456</b> is a OTP to verified your account!</p>
      `,
    };
    await sendMail(mailBody, (error, info) => {
      if (error) {
        return res.status(400).json({ Status: 'Failure', Details: error });
      }
      return res.status(200).json(info.response);
    });
  } catch (error) {
    return res.status(400).json({ Status: 'Failure', Details: error });
  }
};
