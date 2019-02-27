import * as Redis from 'redis';
import * as util from 'util';
import config from '../config';
import { errLog } from '../libs/log';

const redisConfig = config.get('redis')[config.get('env')];

const client = Redis.createClient({
  host: redisConfig.host,
  port: redisConfig.port,
  no_ready_check: true,
  connect_timeout: 60000 * 60
});

client.auth(redisConfig.pwd, err => {
  if (err) {
    console.log(err);
  }
});

client.on('error', err => {
  errLog(err);
});

const getAsync = util.promisify(client.get).bind(client);
const pexpireAsync = util.promisify(client.pexpire).bind(client);
const ttlAsync = util.promisify(client.ttl).bind(client);
const setAsync = util.promisify(client.set).bind(client);

const clientPro: IRedisPro = Object.assign(client, { getAsync, pexpireAsync, ttlAsync, setAsync });

interface IRedisPro extends Redis.RedisClient {
  getAsync: (key: string) => Promise<string>;
  pexpireAsync: (key: string, milliseconds: number) => Promise<number>;
  ttlAsync: (key: string) => Promise<number>;
  setAsync: (key: string, value: string) => Promise<{}>;
}

export default clientPro;
