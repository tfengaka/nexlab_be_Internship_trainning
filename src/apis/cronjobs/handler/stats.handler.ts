import { deleteObject, listAll, ref } from 'firebase/storage';
import { IHandler } from '~/apis/types';
import { storage } from '~/config/firebase';

export const daily_export_file_cleanup: IHandler = () => {
  console.log('Cleaning up');
  const listRef = ref(storage, 'exports/xlsx');
  listAll(listRef)
    .then((res) => {
      res.items.forEach(async (itemRef) => {
        const desertRef = ref(storage, itemRef.fullPath);
        await deleteObject(desertRef);
      });
    })
    .catch((error) => {
      throw error;
    });
  console.log('Cleaned up storage');
  return 'Cleaned up';
};
