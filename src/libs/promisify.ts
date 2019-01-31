import * as util from 'util';
import * as fs from 'fs';
import * as http from 'http';

export const fs_stat = util.promisify(fs.stat);

export const fs_readdir = util.promisify(fs.readdir);

export const fs_unlink = util.promisify(fs.unlink);

export const http_request = util.promisify(http.request);

export const fs_readFile = util.promisify(fs.readFile);