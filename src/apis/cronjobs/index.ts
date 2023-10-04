import { Router } from 'express';
import { IHandler, IHasuraCronjob } from '~/apis/types';
import { wrapperHandler } from '~/utils';

import { daily_enrollment_cleanup } from './handler/enrollment.handler';

const handlers = [daily_enrollment_cleanup];
const router = Router();

router.post(
  '',
  wrapperHandler<IHasuraCronjob>(handlers as IHandler[], (body) => ({
    id: body.id,
    name: body.name,
    payload: body.payload,
    scheduled_time: body.schedule_time,
  }))
);

export { router };
