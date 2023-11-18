import { Router } from 'express';
import { IHandler, IHasuraAction } from '~/apis/types';
import { wrapperHandler } from '~/utils';

import { change_password, otp_verify, refresh_token, resend_otp, sign_in, sign_up } from './handler/auth.handler';
import { parse_barcode_from_url } from './handler/barcode.handler';
import { enroll_class } from './handler/class.handler';
import { export_student_stats, get_excel_data_from_url } from './handler/stats.handler';

const router: Router = Router();
const handlers = [
  sign_in,
  sign_up,
  refresh_token,
  otp_verify,
  resend_otp,
  enroll_class,
  change_password,
  export_student_stats,
  get_excel_data_from_url,
  parse_barcode_from_url,
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
