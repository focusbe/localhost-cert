const CERT_VERSION = 'v2';
const CERT_DIRECTORY = `certs/${CERT_VERSION}`;
const ROOT_CERT_BASENAME = 'root';
const SERVER_CERT_BASENAME = 'localhost';

const getCertRelativePath = (fileName) => `${CERT_DIRECTORY}/${fileName}`;
const getRootCertFilename = (extension) =>
    `${ROOT_CERT_BASENAME}.${extension}`;
const getServerCertFilename = (extension) =>
    `${SERVER_CERT_BASENAME}.${extension}`;
const getRootCertPath = (extension) =>
    getCertRelativePath(getRootCertFilename(extension));
const getServerCertPath = (extension) =>
    getCertRelativePath(getServerCertFilename(extension));

module.exports = {
    CERT_VERSION,
    CERT_DIRECTORY,
    ROOT_CERT_BASENAME,
    SERVER_CERT_BASENAME,
    getCertRelativePath,
    getRootCertFilename,
    getServerCertFilename,
    getRootCertPath,
    getServerCertPath,
};

