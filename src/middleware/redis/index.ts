import * as Redis from 'redis';
import { errLog } from '../../libs/log';

const client = Redis.createClient(6379, '118.24.103.174');

client.auth('zyhua1122', err => {
  if (err) {
    console.log(err);
  }
});

client.on('error', err => {
  errLog(err);
});


export default client;
