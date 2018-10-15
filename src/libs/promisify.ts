import * as util from 'util';
import * as fs from 'fs';

export const fs_stat = util.promisify(fs.stat);
