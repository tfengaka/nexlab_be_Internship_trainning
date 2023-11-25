import { Router } from 'express';
import { IHandler, IHasuraEvent } from '~/apis/types';
import { wrapperHandler } from '~/utils';

import { send_otp } from './handler/send-otp.handler';
import { get_data_barcode } from './handler/detect-barcode.handler';

const handlers = [send_otp, get_data_barcode];

const router = Router();
router.post(
  '',
  wrapperHandler<IHasuraEvent>(handlers as IHandler[], (body) => ({
    name: body.trigger.name,
    op: body.event.op,
    payload: body.event.data,
    session_variables: body.event.session_variables,
  }))
);

export { router };
