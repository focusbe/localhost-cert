const path = require('path');
const fs = require('fs-extra');
const {
    CERT_DIRECTORY,
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
    const targetPath = path.resolve(__dirname, '../', file);
    fs.ensureDirSync(path.dirname(targetPath));
    return fs.writeFileSync(targetPath, content);
}
function resolveCertPath(name) {
    if (name.startsWith(CERT_DIRECTORY) || name.startsWith('certs/')) {
        return name;
    }
    return getCertRelativePath(name);
}
function readCert(name) {
    return readFileFromDir(resolveCertPath(name));
}
function writeCert(name, content) {
    return writeFileToDir(resolveCertPath(name), content);
}
module.exports = {
    readFileFromDir,
    readFileFromDirAsync,
    getRootCrt,
    writeFileToDir,
    readCert,
    writeCert,
};
