import { Router } from 'express';
import { IHandler, IHasuraCronjob } from '~/apis/types';
import { wrapperHandler } from '~/utils';

import { hourly_otp_cleanup } from './handler/otp_code.handler';

const handlers = [hourly_otp_cleanup];
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
