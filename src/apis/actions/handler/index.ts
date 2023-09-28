import { Request, Response } from 'express';
import { sign_in, sign_up } from './auth.handler';

export interface IContextHandler<Payload> {
  req: Request;
  res: Response;
  params: Payload;
  session_variables?: Record<string, string>;
}
export type IHandler<R = Record<string, unknown>> = (context: IContextHandler<R>) => Promise<any> | any;

export default [sign_in, sign_up];
