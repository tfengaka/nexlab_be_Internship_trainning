import { createClient } from 'redis';
import env from './env';

interface RedisSetArguments {
  key: string;
  value: number | Buffer;
  timeType: 'EX' | 'EX' | 'PX' | 'EXAT' | 'PXAT' | 'KEEPTTL';
  time: number;
}

const client = createClient({
  url: `redis://${env.REDIS_HOST}:${env.REDIS_PORT}`,
});

async function set({ key, value, timeType, time }: RedisSetArguments) {
  await client.connect();
  await client.set(key, value, {
    [timeType]: time,
  });
  await client.disconnect();
}

async function get(key: string) {
  await client.connect();
  const value = await client.get(key);
  await client.disconnect();
  return value;
}

export default { set, get };
