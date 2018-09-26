import * as Redis from 'redis';
import * as Util from 'util';
import config from '../config';
import { errLog } from '../libs/log';

const { promisify } = Util;

const redisConfig = config.get('redis')[config.get('env')];

const client = Redis.createClient(redisConfig.host, redisConfig.url);

client.auth(redisConfig.pwd, err => {
  if (err) {
    console.log(err);
  }
});

client.on('error', err => {
  errLog(err);
});

const getAsync = promisify(client.get).bind(client);
const pexpireAsync = promisify(client.pexpire).bind(client);
const ttlAsync = promisify(client.ttl).bind(client);
const setAsync = promisify(client.set).bind(client);

const clientPro: IRedisPro = Object.assign(client, { getAsync, pexpireAsync, ttlAsync, setAsync });

interface IRedisPro extends Redis.RedisClient {
  getAsync: (key: string) => Promise<string>;
  pexpireAsync: (key: string, milliseconds: number) => Promise<number>;
  ttlAsync: (key: string) => Promise<number>;
  setAsync: (key: string, value: string) => Promise<number>;
}

export default clientPro;
