import axios from 'axios';
import Excel from 'exceljs';
import { GraphQLError } from 'graphql';
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

export const get_excel_data_from_url: IHandler<{ url: string }> = async ({ payload: { url } }) => {
  if (!url) {
    throw new GraphQLError('Invalid request!', {
      extensions: {
        code: 'BAD_REQUEST',
      },
    });
  }
  const rawData = await axios.get(url, { responseType: 'stream' }).then((res) => res.data);
  const workbook = new Excel.Workbook();
  await workbook.xlsx.read(rawData);
  const worksheet = workbook.worksheets[0];

  const images = worksheet.getImages();
  const image_urls = await Promise.all(
    images.map(async (image) => {
      console.log('IMAGE ID: ', image.imageId);
      const _image = workbook.getImage(parseInt(image.imageId));
      const image_url = await uploadToFirebase(
        _image.buffer!,
        `worksheets/${worksheet.name}/images/${image.imageId}.${_image.extension}`,
        `${image.type}/${_image.extension}`
      );
      return image_url;
    })
  );
  return [...image_urls];
};
