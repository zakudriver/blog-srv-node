import * as nconf from 'nconf';
import * as path from 'path';

let config = nconf
  .argv()
  .env()
  .file({ file: 'config.json' });
config.set('root', path.join(__dirname, '.'));
config.set('env', process.env.NODE_ENV);

export default config;
