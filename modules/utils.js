const path = require('path');
const fs = require('fs-extra');
const {
    getCertRelativePath,
    getRootCertPath,
} = require('./shared');
function readFileFromDir(file) {
    return fs.readFileSync(path.resolve(__dirname, '../', file), 'utf-8');
}
function readFileFromDirAsync(file) {
    return fs.readFile(path.resolve(__dirname, '../', file), 'utf-8');
}
function getRootCrt() {
    return readFileFromDirAsync(getRootCertPath('crt'));
}
function writeFileToDir(file, content) {
    return fs.writeFileSync(path.resolve(__dirname, '../', file), content);
}
function readCert(name) {
    return readFileFromDir(getCertRelativePath(name));
}
function writeCert(name, content) {
    return writeFileToDir(getCertRelativePath(name), content);
}
module.exports = {
    readFileFromDir,
    readFileFromDirAsync,
    getRootCrt,
    writeFileToDir,
    readCert,
    writeCert,
};
