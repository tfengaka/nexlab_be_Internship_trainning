import { Request, Response, Router } from 'express';
import { HasuraHeader, Role } from '~/enum';
import { getCurrentStudent } from '~/service/student.service';

const authRouter: Router = Router();

authRouter.get('', async (req: Request, res: Response) => {
  try {
    const bearer_token = req.headers?.authorization;
    if (!bearer_token)
      return res.json({
        [HasuraHeader.Role]: Role.Anonymous,
      });
    const token = bearer_token.split(' ')[1];
    const currentUser = await getCurrentStudent(token);

    if (!currentUser)
      return res.json({
        [HasuraHeader.Role]: Role.Anonymous,
      });

    return res.json({
      [HasuraHeader.Role]: 'user',
      [HasuraHeader.UserId]: currentUser.id,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      [HasuraHeader.Role]: Role.Anonymous,
    });
  }
});

export { authRouter };
