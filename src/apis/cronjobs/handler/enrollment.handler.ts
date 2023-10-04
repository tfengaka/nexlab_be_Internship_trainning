import { Op } from 'sequelize';
import { IHandler } from '~/apis/types';
import model from '~/model';

export const daily_enrollment_cleanup: IHandler = async () => {
  const expired_enrollment_count = await model.Enrollment.destroy({
    where: {
      expired_at: {
        [Op.lt]: new Date(),
      },
    },
  });
  return `affected_rows: ${expired_enrollment_count}`;
};

//
