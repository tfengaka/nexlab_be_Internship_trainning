import Quagga from '@ericblade/quagga2';
import { Decoder } from '@nuintun/qrcode';
import axios from 'axios';
import Jimp from 'jimp';
import { GraphQLError } from 'graphql';
import { IBarcodeFormat, IBarcodeInput, IHandler, IHandlerForm } from '~/apis/types';

interface IScanDevice {
  id: string;
  modelNumber: string;
  serialNumber: string;
  type: string;
  deviceType: {
    id: string;
    code: string;
    englishName: string;
    name: string;
  };
}

export const parse_barcode_from_url: IHandler<IHandlerForm<IBarcodeInput>> = async ({ payload }) => {
  const { form } = payload;
  if (!form.url || !form.type) {
    throw new GraphQLError('Invalid request!', {
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

const detectBarcode = async (imageUrl: string) => {
  let imageType = 'image/jpg';

  const imageBase64 = await axios.get(imageUrl, { responseType: 'arraybuffer' }).then((res) => {
    imageType = res.headers['content-type'];
    return Buffer.from(res.data, 'binary').toString('base64');
  });
  const barcodeResult = await Quagga.decodeSingle({
    src: `data:${imageType};base64,${imageBase64}`,
    numOfWorkers: 0, // Needs to be 0 when used within node
    inputStream: {
      size: 1920,
      area: {
        // defines rectangle of the detection/localization area
        top: '10%', // top offset
        right: '10%', // right offset
        left: '10%', // left offset
        bottom: '10%', // bottom offset
      },
      singleChannel: true,
    },
    decoder: {
      readers: ['code_128_reader', 'codabar_reader', 'code_39_reader'],
    },
    frequency: 3,
    locator: {
      patchSize: 'small',
      halfSample: false,
    },
  });
  if (barcodeResult && barcodeResult.codeResult) {
    const modelDevice = parseModelDataFromDecodeValue(barcodeResult.codeResult.code as string);
    return { message: `Barcode Value: ${modelDevice}` };
  }

  return { message: 'Can not detect barcode from this image!' };
};

export const detectQRCode = async (imageUrl: string) => {
  const QRCodeDecoder = new Decoder();

  const imgBuffer = await axios
    .get(imageUrl, { responseType: 'arraybuffer' })
    .then((res) => Buffer.from(res.data, 'binary'));

  const jimpImage = await Jimp.read(imgBuffer);
  const { data, width, height } = jimpImage.bitmap;
  const uint8Array = new Uint8ClampedArray(data);

  const result = QRCodeDecoder.decode(uint8Array, width, height);
  if (result) {
    const modelDevice = parseModelDataFromDecodeValue(result.data);
    console.log(modelDevice);
    return { message: `QRCode Data: ${result.data}` };
  }
  return { message: 'Can not detect QR code from this image!' };
};

export const parseModelDataFromDecodeValue = (decodeValue: string) => ({
  modelNumber: decodeValue.slice(0, 6),
  serialNumber: decodeValue.slice(6, -1),
});
