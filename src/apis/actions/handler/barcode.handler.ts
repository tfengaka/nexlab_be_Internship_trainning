import { Decoder } from '@nuintun/qrcode';
import axios from 'axios';
import Jimp from 'jimp';
import { GraphQLError } from 'graphql';
import { IBarcodeFormat, IBarcodeInput, IHandler, IHandlerForm } from '~/apis/types';
import Quagga from '@ericblade/quagga2';

export const parse_barcode_from_url: IHandler<IHandlerForm<IBarcodeInput>> = async ({ payload }) => {
  const { form } = payload;

  if (!form.type || !form.url) {
    throw new GraphQLError('Bad Request', {
      extensions: {
        code: 'BAD_REQUEST',
      },
    });
  }

  switch (form.type) {
    case IBarcodeFormat.Barcode:
      return await detectBarcode(form.url);
    case IBarcodeFormat.QRCode:
      return await detectQRCode(form.url);
    default:
      throw new GraphQLError('Invalid barcode format', {
        extensions: {
          code: 'BAD_REQUEST',
        },
      });
  }
};

async function parseImageUrlToImageData(input: string) {
  const rawImage = await axios
    .get(input, { responseType: 'arraybuffer' })
    .then((res) => Buffer.from(res.data, 'binary'));
  const jimpImage = await Jimp.read(rawImage);
  return jimpImage;
}

const detectBarcode = async (imageUrl: string) => {
  const base64 = await axios
    .get(imageUrl, { responseType: 'arraybuffer' })
    .then((res) => Buffer.from(res.data, 'binary').toString('base64'));

  const barcodeResult = await Quagga.decodeSingle({
    src: base64,
    numOfWorkers: 0, // Needs to be 0 when used within node
    inputStream: {
      size: 1920,
      area: {
        // defines rectangle of the detection/localization area
        top: '0%', // top offset
        right: '0%', // right offset
        left: '0%', // left offset
        bottom: '0%', // bottom offset
      },
      singleChannel: true,
    },
    decoder: {
      readers: ['code_39_reader', 'code_128_reader', 'codabar_reader'],
    },
    frequency: 3,
    locator: {
      patchSize: 'small',
    },
  });
  if (barcodeResult && barcodeResult.codeResult) {
    const modelDevice = parseModelDataFromDecodeValue(barcodeResult.codeResult.code as string);
    return modelDevice;
  }

  throw new GraphQLError('Cant Detected', {
    extensions: {
      code: 'BAD_REQUEST',
    },
  });
};

export const detectQRCode = async (imageURL: string) => {
  const image = await parseImageUrlToImageData(imageURL);
  const { data, width, height } = image.bitmap;
  const uint8Array = new Uint8ClampedArray(data);

  const QRCodeDecoder = new Decoder();
  const result = QRCodeDecoder.decode(uint8Array, width, height);
  if (result) {
    const modelDevice = parseModelDataFromDecodeValue(result.data);
    console.log(modelDevice);
    return modelDevice;
  }
  throw new GraphQLError('Cant Detected', {
    extensions: {
      code: 'BAD_REQUEST',
    },
  });
};

export const parseModelDataFromDecodeValue = (decodeValue: string) => ({
  modelNumber: decodeValue.slice(0, 6),
  serialNumber: decodeValue.slice(6, -1),
});
