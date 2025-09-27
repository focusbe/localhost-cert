const {
    readFileFromDir,
    readFileFromDirAsync,
    getRootCrt,
} = require('../modules/utils');
const { getRootCertPath } = require('../modules/shared');

console.log(readFileFromDir(getRootCertPath('crt')));

readFileFromDirAsync(getRootCertPath('crt')).then((res) => {
    console.log(res);
});
getRootCrt().then((res) => {
    console.log(res);
});
