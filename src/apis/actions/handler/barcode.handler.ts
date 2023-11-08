import Quagga from '@ericblade/quagga2';
import axios from 'axios';
import { GraphQLError } from 'graphql';
import { IHandler, IHandlerForm } from '~/apis/types';

export const parse_barcode_from_url: IHandler<IHandlerForm<IBarcodeInput>> = async ({ payload }) => {
  const { form } = payload;
  if (!form.url) {
    throw new GraphQLError('Invalid request!', {
      extensions: {
        code: 'BAD_REQUEST',
      },
    });
  }
  const rawImage = await axios
    .get(form.url, { responseType: 'arraybuffer' })
    .then((res) => Buffer.from(res.data, 'binary').toString('base64'));

  Quagga.decodeSingle(
    {
      src: 'data:image/jpg;base64,' + rawImage,
      numOfWorkers: 0, // Needs to be 0 when used within node
      inputStream: {
        type: 'ImageStream',
        singleChannel: false,
        size: 800,
      },
      decoder: {
        readers: ['code_39_reader', 'code_39_vin_reader'],
        multiple: false,
      },
      locate: true,
      locator: {
        patchSize: 'medium',
        halfSample: true,
      },
    },
    function (result) {
      console.log(result);
      if (result.codeResult) {
        console.log('result', result.codeResult.code);
      } else {
        console.log('not detected');
      }
    }
  );

  return { message: 'Can not detect barcode from this image!' };
};
