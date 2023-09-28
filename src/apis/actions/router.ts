import { Router, Request, Response } from 'express';
import { SignIn, SignUp } from '~/service/student.service';

const actionRouter: Router = Router();

actionRouter.post('/sign-in', async (req: Request<object, object, ActionPayload<SignInInput>>, res: Response) => {
  try {
    console.log('Request headers: ', req.headers);
    console.log('Request body: ', req.body);
    const { email, password } = req.body.input;
    const resData = await SignIn({ email, password });
    return res.json(resData);
  } catch (error) {
    return res.status(400).json(error);
  }
});

actionRouter.post('/sign-up', async (req: Request<object, object, ActionPayload<SignUpInput>>, res: Response) => {
  try {
    console.log('Request headers: ', req.headers);
    console.log('Request body: ', req.body);
    const { email, password, fullName } = req.body.input;
    const resData = await SignUp({ email, password, fullName });
    return res.json(resData);
  } catch (error) {
    return res.status(400).json(error);
  }
});

export { actionRouter };
