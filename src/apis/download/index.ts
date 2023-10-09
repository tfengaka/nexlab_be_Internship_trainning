import { Request, Response, Router } from 'express';
import fs from 'fs';
import path from 'path';
import { OUTPUT_DIR } from '~/utils';

interface IQueryParams {
  name: string;
}

const router = Router();

router.get('/file', (req: Request<object, object, object, IQueryParams>, res: Response) => {
  const { name } = req.query;
  const filePath = path.join(OUTPUT_DIR, name);
  if (fs.existsSync(filePath)) {
    res.download(filePath, (err) => {
      if (err) {
        console.error('Lỗi khi tải tệp: ', err);
        res.status(500).send('File download failed!');
      }
    });
  } else {
    res.status(404).send('Cant find this file');
  }
});

export { router };
