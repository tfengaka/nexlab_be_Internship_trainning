import xlsx from 'xlsx';
import { IHandler } from '~/apis/types';
import { sequelize } from '~/model';
import { uploadToFirebase } from '~/utils';

export const export_student_stats: IHandler = async () => {
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
  const outputFirebase = xlsx.write(workbook, {
    type: 'array',
    compression: true,
    bookType: 'xlsx',
  });
  const file_name = `${Date.now().toString()}_students_stats.xlsx`;
  const url = await uploadToFirebase(outputFirebase, `exports/xlsx/${file_name}`);
  return { url };
};
