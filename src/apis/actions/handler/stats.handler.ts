import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';
import { IHandler } from '~/apis/types';
import env from '~/config/env';
import { sequelize } from '~/model';
import { OUTPUT_DIR } from '~/utils';

export const get_student_stats: IHandler = async ({ req, res }) => {
  const records = await sequelize.query('SELECT * FROM student_stats');
  const result = records[0] as IStudentStats[];

  const rows = result.map((row) => ({
    id: row.student_id,
    full_name: row.student_name,
    registered_count: row.register_class_count,
    unregistered_count: row.unregister_class_count,
  }));

  const worksheet = xlsx.utils.json_to_sheet(rows);
  const workbook = xlsx.utils.book_new();
  xlsx.utils.sheet_add_aoa(worksheet, [['id', 'full_name', 'registered_count', 'unregistered_count']], {
    origin: 'A1',
  });
  worksheet['!cols'] = [{ wch: 35 }, { wch: 40 }, { wch: 20 }, { wch: 20 }];
  xlsx.utils.book_append_sheet(workbook, worksheet, 'students_stats');
  const output = xlsx.write(workbook, {
    type: 'buffer',
    compression: true,
    bookType: 'xlsx',
  });
  const randomNumber = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');
  const file_name = `${randomNumber}-students-stats.xlsx`;
  const file_path = path.join(OUTPUT_DIR, file_name);
  fs.writeFileSync(file_path, output);
  return {
    url: `${req.protocol}://${env.HOST}/download/file?name=${file_name}`,
  };
};
