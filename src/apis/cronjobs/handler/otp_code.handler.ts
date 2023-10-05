import { Op } from 'sequelize';
import { IHandler } from '~/apis/types';
import model from '~/model';

export const otp_cleanup_every_10_minutes: IHandler = async () => {
  const cleanup_otp_count = await model.OTP_Code.destroy({
    where: {
      expired_at: {
        [Op.lt]: new Date(),
      },
    },
  });
  return `affected_rows: ${cleanup_otp_count}`;
};
