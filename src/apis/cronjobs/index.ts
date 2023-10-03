import { Router } from 'express';
import { IHandler, IHasuraCronjob } from '~/apis/types';
import { wrapperHandler } from '~/utils';
import { clear_expired_enrollment } from './handler/clear_enrollment.handler';

const handlers = [clear_expired_enrollment];
const router = Router();
router.post(
  '',
  wrapperHandler<IHasuraCronjob>(handlers as IHandler[], (body) => ({
    name: body.name,
    payload: body.payload,
  }))
);

export { router };
