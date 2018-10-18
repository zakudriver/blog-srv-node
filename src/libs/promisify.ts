import * as util from 'util';
import * as fs from 'fs';

export const fs_stat = util.promisify(fs.stat);

export const fs_readdir = util.promisify(fs.readdir);

export const fs_unlink = util.promisify(fs.unlink);
