import { Router } from 'express';
import { IHandler, IHasuraAction } from '~/apis/types';
import { wrapperHandler } from '~/utils';

import { change_password, otp_verify, refresh_token, resend_otp, sign_in, sign_up } from './handler/auth.handler';
import { enroll_class } from './handler/class.handler';
import { get_student_stats } from './handler/stats.handler';

const router: Router = Router();
const handlers = [
  sign_in,
  sign_up,
  refresh_token,
  otp_verify,
  resend_otp,
  enroll_class,
  change_password,
  get_student_stats,
];

router.post(
  '',
  wrapperHandler<IHasuraAction>(handlers as IHandler[], (body) => ({
    name: body.action.name,
    payload: body.input,
    session_variables: body.session_variables,
  }))
);

export { router };
