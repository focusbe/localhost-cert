// 调用检测函数
const checkRootCertInstall = require('./modules/checkRootCertInstall');
const installRootCert = require('./modules/installRootCert');
const { readCert } = require('./modules/utils');

const getHttpsConfig = async ({ autoInstall = true } = {}) => {
    if (autoInstall) {
        const isInstalled = await checkRootCertInstall();
        console.log('is root install', isInstalled);
        if (!isInstalled) {
            await installRootCert();
        }
    }

    return {
        cert: readCert('localhost.crt'),
        key: readCert('localhost.key'),
    };
};

module.exports = getHttpsConfig;
