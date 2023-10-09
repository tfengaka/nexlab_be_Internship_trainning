import fs from 'fs';
import { GraphQLError } from 'graphql';
import path from 'path';
import { IHandler } from '~/apis/types';
import { OUTPUT_DIR } from '~/utils';

export const daily_export_file_cleanup: IHandler = () => {
  let counter = 0;

  fs.readdir(OUTPUT_DIR, (err, files) => {
    if (err) {
      console.error('Lỗi khi đọc thư mục: ', err);
      return;
    }
    files.forEach((file) => {
      if (path.extname(file) === '.xlsx') {
        const filePath = path.join(OUTPUT_DIR, file);
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(`Delete ${file} error: `, err);
            throw new GraphQLError(err.message, {
              extensions: {
                code: err.code,
              },
            });
          }
          counter++;
        });
      }
    });
  });
  return `affected_rows: ${counter}`;
};
