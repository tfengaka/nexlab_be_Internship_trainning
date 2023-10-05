import { Router } from 'express';
import { IHandler, IHasuraCronjob } from '~/apis/types';
import { wrapperHandler } from '~/utils';

import { daily_enrollment_cleanup } from './handler/enrollment.handler';
import { otp_cleanup_every_10_minutes } from './handler/otp_code.handler';

const handlers = [daily_enrollment_cleanup, otp_cleanup_every_10_minutes];
const router = Router();

router.post(
  '',
  wrapperHandler<IHasuraCronjob>(handlers as IHandler[], (body) => ({
    name: body.name,
    payload: body.payload,
    scheduled_time: body.schedule_time,
  }))
);

export { router };
