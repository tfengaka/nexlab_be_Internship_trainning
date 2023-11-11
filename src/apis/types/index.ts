import { Request, Response } from 'express';

export enum HasuraHeader {
  UserId = 'x-hasura-user-id',
  Role = 'x-hasura-role',
}

export enum Role {
  Anonymous = 'anonymous',
  User = 'user',
}

export enum OperandType {
  Insert = 'INSERT',
  Update = 'UPDATE',
  Delete = 'DELETE',
  Manual = 'MANUAL',
}

export interface IHasuraAction<Payload = Record<string, any>> {
  action: {
    name: string;
  };
  input: Payload;
  session_variables: Record<string, string>;
}

export interface IHasuraEvent<Payload = Record<string, any>> {
  trigger: {
    name: string;
  };
  event: {
    data: Payload;
    op: OperandType;
    session_variables: Record<string, string>;
  };
}

export interface IHasuraCronjob<Payload = Record<string, any>> {
  id: string;
  name: string;
  payload: Payload;
  schedule_time: string;
}

export interface IContextHandler<Payload> {
  req: Request;
  res: Response;
  op?: OperandType;
  payload: Payload;
  session_variables?: Record<string, string>;
}
export type IHandler<Req = Record<string, unknown>, Res = Record<string, any>> = (
  context: IContextHandler<Req>
) => Promise<Res> | unknown;

export interface IHandlerForm<T> {
  form: T;
}

export enum IBarcodeFormat {
  Barcode = 'barcode',
  QRCode = 'qrcode',
}

export interface IBarcodeInput {
  url: string;
  type: IBarcodeFormat;
}
