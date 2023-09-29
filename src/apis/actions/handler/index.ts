import { Request, Response } from 'express';
import { sign_in, sign_up, refresh_token } from './auth.handler';

export interface IContextHandler<Payload> {
  req: Request;
  res: Response;
  params: Payload;
  session_variables?: Record<string, string>;
}
export type IHandler<Req = Record<string, unknown>, Res = Record<string, any>> = (
  context: IContextHandler<Req>
) => Promise<Res> | unknown;

export default [sign_in, sign_up, refresh_token];
