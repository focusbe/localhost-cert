// 判断当前是否存在文件
const fs = require('fs');
const path = require('path');
const createRootCert = require('./modules/createRootCert');
const uploadToGithub = require('./modules/uploadToGithub');
const {
    getRootCertPath,
    getServerCertPath,
} = require('./modules/shared');
function isFileExist(filePath) {
    try {
        fs.accessSync(filePath, fs.constants.F_OK);
        return true;
    } catch (error) {
        return false;
    }
}

if (
    !isFileExist(path.resolve(__dirname, getRootCertPath('crt'))) ||
    !isFileExist(path.resolve(__dirname, getServerCertPath('key'))) ||
    !isFileExist(path.resolve(__dirname, getServerCertPath('crt')))
) {
    createRootCert();
    uploadToGithub();
} else {
    console.log('certs already exist');
}
