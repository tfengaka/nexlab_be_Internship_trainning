import { Request, Response, Router } from 'express';
import { get_user_by_token } from '../actions/handler/auth.handler';
import { HasuraHeader, Role } from '../types';

const router: Router = Router();

router.get('', async (req: Request, res: Response) => {
  try {
    const bearer_token = req.headers?.authorization;
    if (!bearer_token)
      return res.json({
        [HasuraHeader.Role]: Role.Anonymous,
      });
    const token = bearer_token.split(' ')[1];
    const currentUser = await get_user_by_token(token);

    if (!currentUser)
      return res.json({
        [HasuraHeader.Role]: Role.Anonymous,
      });

    return res.json({
      [HasuraHeader.Role]: Role.User,
      [HasuraHeader.UserId]: currentUser.id,
    });
  } catch (error) {
    return res.sendStatus(401);
  }
});

export { router };
