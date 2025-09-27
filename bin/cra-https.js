// set cra https env
const path = require('path');
const { getServerCertPath } = require('../modules/shared');
process.env.HTTPS = true;
process.env.SSL_CRT_FILE = path.resolve(
    __dirname,
    '..',
    getServerCertPath('crt')
);
process.env.SSL_KEY_FILE = path.resolve(
    __dirname,
    '..',
    getServerCertPath('key')
);