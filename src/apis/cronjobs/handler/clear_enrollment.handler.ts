import { Op } from 'sequelize';
import { IHandler } from '~/apis/types';
import model from '~/model';
export const clear_expired_enrollment: IHandler = async ({ res, payload }) => {
  try {
    const expired_enrollment = await model.Enrollment.findAll({
      where: {
        expired_at: {
          [Op.gt]: new Date(),
        },
      },
    });
    // Destroy all record above
    console.log(expired_enrollment);
    res.status(200).json({ message: 'OK' });
  } catch (error) {
    res.status(400).json(error);
  }
};
