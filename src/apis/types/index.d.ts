import { Request, Response } from 'express';

export enum OperandType {
  Insert = 'INSERT',
  Update = 'UPDATE',
  Delete = 'DELETE',
  Manual = 'MANUAL',
}

export interface IHasuraAction<Type = Record<string, any>> {
  action: {
    name: string;
  };
  input: Type;
  request_query: string;
  session_variables: Record<string, string>;
}

export interface IHasuraEvent<Data = Record<string, any>> {
  created_at: string;
  delivery_info: {
    current_retry: number;
    max_retries: number;
  };
  event: {
    data: Data;
    op: OperandType;
    session_variables: Record<string, string>;
    trace_context: {
      span_id: string;
      trace_id: string;
    };
  };
  id: string;
  table: {
    name: string;
    schema: string;
  };
  trigger: {
    name: string;
  };
}

export interface IHasuraCronjob<Payload = Record<string, any>> {
  id: string;
  name: string;
  payload: Payload;
  schedule_time: string;
  comment: string;
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
