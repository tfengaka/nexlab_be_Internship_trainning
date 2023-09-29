import { Router, Request, Response } from 'express';
import handlers, { IHandler } from './handler';
import { GraphQLError } from 'graphql';

const wrapperHandler =
  (
    handler: IHandler[],
    req_data: (body: IHasuraAction) => {
      name: string;
      params: Record<string, any>;
      session_variables: Record<string, string>;
    }
  ) =>
  async (req: Request, res: Response) => {
    try {
      const { name, params, session_variables } = req_data(req.body);
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

      const res_data = await targetHandler({ req, res, params, session_variables });

      return res.json(res_data);
    } catch (error) {
      return res.status(400).json(error);
    }
  };

const router: Router = Router();
router.post(
  '',
  wrapperHandler(handlers as IHandler[], (body: IHasuraAction) => ({
    name: body.action.name,
    params: body.input,
    session_variables: body.session_variables,
  }))
);

export { router };
