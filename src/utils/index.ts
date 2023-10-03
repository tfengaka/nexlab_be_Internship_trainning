import { Request, Response } from 'express';
import { GraphQLError } from 'graphql';
import nodeMailer from 'nodemailer';
import { Options, SentMessageInfo } from 'nodemailer/lib/smtp-transport';
import { IHandler, OperandType } from '~/apis/types';
import env from '~/config/env';

interface MailRequestOptions {
  to: string;
  subject: string;
  html?: string;
}

const transport = nodeMailer.createTransport({
  service: 'Gmail',
  secure: true,
  auth: {
    user: env.MAIL_USERNAME,
    pass: env.MAIL_PASSWORD,
  },
} as Options);

export const sendMail = async (
  { to, subject, html }: MailRequestOptions,
  callback: (error: Error | null, info: SentMessageInfo) => void
) => {
  await transport.verify();
  transport.sendMail(
    {
      from: {
        name: env.MAIL_FROM_NAME,
        address: env.MAIL_FROM_ADDRESS,
      },
      to: to,
      subject: subject,
      html: html,
    },
    callback
  );
};

export function wrapperHandler<Body = Record<string, any>>(
  handler: IHandler[],
  req_data: (body: Body) => {
    name: string;
    op?: OperandType;
    payload: Record<string, any>;
    session_variables?: Record<string, string>;
  }
) {
  return async (req: Request, res: Response) => {
    try {
      const { name, payload, op, session_variables } = req_data(req.body);
      console.log('session_variables', session_variables);
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
      return res.status(400).json(error);
    }
  };
}
