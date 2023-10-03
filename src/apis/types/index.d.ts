import { Request, Response } from 'express';

export interface IHasuraAction<Type = Record<string, any>> {
  action: {
    name: string;
  };
  input: Type;
  request_query: string;
  session_variables: Record<string, string>;
}

export interface IHasuraEvent<New = Record<string, any> | null, Old = Record<string, any> | null> {
  created_at: string;
  delivery_info: {
    current_retry: number;
    max_retries: number;
  };
  event: {
    data: {
      new: New;
      old: Old;
    };
    op: 'INSERT' | 'UPDATE' | 'DELETE' | 'MANUAL';
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

export interface IContextHandler<Payload> {
  req: Request;
  res: Response;
  data: Payload;
  session_variables?: Record<string, string>;
}
export type IHandler<Req = Record<string, unknown>, Res = Record<string, any>> = (
  context: IContextHandler<Req>
) => Promise<Res> | unknown;
