import Quagga from '@ericblade/quagga2';
import { Decoder } from '@nuintun/qrcode';
import { GraphQLError } from 'graphql';
import Jimp from 'jimp';
import { IBarcodeFormat, IHandler } from '~/apis/types';
import Model from '~/model';
import { IEventLogAttributes } from '~/model/event-log';

interface IScanDeviceMetadata {
  codeType: string;
  base64: string;
}

const parsedBase64toImageData = async (base64: string) => {
  const jimpImage = await Jimp.read(Buffer.from(base64.split(',')[1], 'base64'));
  return jimpImage;
};

const detectBarcode = async (base64: string) => {
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
      halfSample: false,
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

const detectQRCode = async (base64: string) => {
  const image = await parsedBase64toImageData(base64);
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

export const get_data_barcode: IHandler<{ new: IEventLogAttributes }> = async ({ payload }) => {
  const { id } = payload.new;
  const eventLog = await Model.EventLog.findByPk(id);
  if (!eventLog) {
    throw new GraphQLError('Can not find data', {
      extensions: {
        code: 'NOT FOUND',
      },
    });
  }

  const { codeType, base64 } = eventLog.metadata as IScanDeviceMetadata;
  let modelDevice;
  switch (codeType) {
    case IBarcodeFormat.Barcode:
      modelDevice = await detectBarcode(base64);
      break;
    case IBarcodeFormat.QRCode:
      modelDevice = await detectQRCode(base64);
      break;
    default:
      throw new GraphQLError('Invalid barcode format', {
        extensions: {
          code: 'BAD_REQUEST',
        },
      });
  }

  if (modelDevice) {
    eventLog.respone = modelDevice;
    eventLog.status = 'success';
    await eventLog.save();
    return modelDevice;
  }
  eventLog.status = 'failure';
  await eventLog.save();

  return { message: 'Detected device is failed' };
};
