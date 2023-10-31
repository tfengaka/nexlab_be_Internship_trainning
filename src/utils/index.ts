import { Request, Response } from 'express';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { GraphQLError } from 'graphql';
import nodeMailer from 'nodemailer';
import { Options } from 'nodemailer/lib/smtp-transport';
import { IHandler, OperandType } from '~/apis/types';
import env from '~/config/env';
import { storage } from '~/config/firebase';

interface MailRequestOptions {
  to: string;
  subject: string;
  html?: string;
}

export const OUTPUT_DIR = `${__dirname}/../../dist/xlsx`;

export function wrapperHandler<Body = Record<string, any>>(
  handler: IHandler[],
  req_data: (body: Body) => {
    name: string;
    op?: OperandType;
    payload: Record<string, any>;
    session_variables?: Record<string, string>;
    scheduled_time?: string;
  }
) {
  return async (req: Request, res: Response) => {
    try {
      const { name, payload, op, session_variables } = req_data(req.body);
      const targetHandler = handler.find((e) => e.name === name);

      if (!targetHandler) {
        const event_error = new GraphQLError('Event not found!', {
          extensions: {
            code: 'NOT_FOUND',
          },
        });
        return res.status(404).json(event_error);
      }

      const res_data = await targetHandler({ req, res, op, payload, session_variables });

      return res.json(res_data);
    } catch (error) {
      console.error(error);
      return res.status(400).json(error);
    }
  };
}

export const sendMail = async ({ to, subject, html }: MailRequestOptions) => {
  const transport = nodeMailer.createTransport({
    host: env.MAIL_HOST,
    secure: true,
    auth: {
      user: env.MAIL_USERNAME,
      pass: env.MAIL_PASSWORD,
    },
  } as Options);

  await transport.verify();
  const info = await transport.sendMail({
    from: env.MAIL_FROM_NAME,
    to: to,
    subject: subject,
    html: html,
  });
  return info;
};

export const otp_email_template = (name: string, otp: string) => `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="ie=edge" />

  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet" />
</head>

<body style="
      margin: 0;
      font-family: 'Poppins', sans-serif;
      background: #ffffff;
      font-size: 14px;
    ">
  <div style="
        max-width: 680px;
        margin: 0 auto;
        padding: 45px 30px 60px;
        background: #f4f7ff;
        font-size: 14px;
        color: #434343;
      ">
    <main>
      <div style="
            margin: 0;
            margin-top: 70px;
            padding: 90px;
            background: #ffffff;
            border-radius: 30px;
            text-align: center;
          ">
        <div style="width: 100%; max-width: 489px; margin: 0 auto;">
          <h1 style="
                margin: 0;
                font-size: 24px;
                font-weight: 500;
                color: #1f1f1f;
              ">
            Verification Email
          </h1>
          <p style="
                margin: 0;
                margin-top: 17px;
                font-size: 16px;
                font-weight: 500;
                text-align: center;
              ">
            Hi<br/><b>${name}</b>
          </p>
          <p style="
                margin: 0;
                margin-top: 16px;
                font-weight: 500;
                letter-spacing: 1.25;
              ">
            Use the following OTP to complete the procedure to verify your account. OTP is valid for
            <span style="font-weight: 700; color: #1f1f1f;">5 minutes</span>.
            Please Don't share this code with others.
          </p>
          <p style="
                width: 100%;
                margin-left: 25px;
                margin-top: 40px;
                font-size: 40px;
                font-weight: 700;
                letter-spacing: 25px;
                text-align: center;
                color: #ba3d4f;
              ">
            ${otp}
          </p>
        </div>
      </div>

      <p style="
            max-width: 400px;
            margin: 0 auto;
            margin-top: 50px;
            text-align: center;
            font-weight: 500;
            color: #8c8c8c;
          ">
        Need help? Ask at
        <a href="mailto:nthoa2.dev@gmail.com" style="color: #499fb6; text-decoration: none;">nthoa2.dev</a>
        or visit our
        <a href="" target="_blank" style="color: #499fb6; text-decoration: none;">Help Center</a>
      </p>
    </main>
  </div>
</body>

</html>
`;

export const uploadToFirebase = async (data: ArrayBuffer | Blob | Uint8Array, file_path: string, type?: string) => {
  const storage_ref = ref(storage, file_path);
  const upload = await uploadBytesResumable(storage_ref, data, {
    contentType: type || 'xlsx',
  });
  return await getDownloadURL(upload.ref);
};
