const https = require('https');
const { getRootCrt } = require('./utils');
const getLocalhostCerts = require('./getLocalhostCerts');
const path = require('path');
const fs = require('fs-extra');
let testServer = null;
async function startTestServer() {
    if (testServer) {
        return testServer;
    }
    const testPort = 11790 + Math.floor(Math.random() * 100);
    const options = getLocalhostCerts();
    try {
        testServer = https.createServer(options, (req, res) => {
            res.writeHead(200);
            res.end('TESTSERVER');
        });
        testServer.on('error', (error) => {
            testServer.close();
        });
        testServer.on('close', () => {
            testServer = null;
        });
        testServer.listen(testPort);
        return { server: testServer, port: testPort };
    } catch (error) {
        return null;
    }
}

// 检测根证书的安装情况
module.exports = async function checkRootCertificateInstallation() {
    try {
        // mac
        if (process.platform === 'darwin') {
            return await checkMacCert();
        }
        // windows
        else if (process.platform === 'win32') {
            return await checkWinCert();
        }
        // linux
        else if (process.platform === 'linux') {
            return await checkLinuxCert();
        }
    } catch (error) {
        console.log('error', error);
        return false;
    }
};

function replaceEnter(str) {
    try {
        return str.replace(/\n/g, '').replace(/\r/g, '').replace(/\t/g, '');
    } catch (error) {
        return str;
    }
}

async function checkMacCert() {
    const macCa = require('mac-ca');
    const rootCrt = await getRootCrt();
    const ca = await macCa.get();
    return ca.some((item) => {
        return item && replaceEnter(item) === replaceEnter(rootCrt);
    });
}

async function checkWinCert() {
    const ca = require('win-ca');
    rootCAs = [];
    // Fetch all certificates in PEM format
    ca({
        format: ca.der2.pem,
        ondata: (crt) => {
            rootCAs.push(crt);
        },
    });
    const rootCrt = await getRootCrt();
    return rootCAs.some((item) => {
        return item && replaceEnter(item) === replaceEnter(rootCrt);
    });
}

async function checkLinuxCert() {
    const certPath = '/usr/local/share/ca-certificates/root.crt';
    const exists = await fs.pathExists(certPath);
    if (!exists) {
        return false;
    }

    const targetHashLink = '/etc/ssl/certs/root.pem';
    const linkExists = await fs.pathExists(targetHashLink);

    try {
        const openssl = require('child_process');
        openssl.execSync(
            `openssl verify -CAfile ${certPath} ${certPath}`,
            { stdio: 'ignore' }
        );
    } catch (error) {
        return false;
    }

    return linkExists;
}
