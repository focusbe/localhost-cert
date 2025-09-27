const forge = require('node-forge');
const { writeCert } = require('./utils');
const {
    getRootCertPath,
    getServerCertPath,
    getRootCertFilename,
    getServerCertFilename,
} = require('./shared');
module.exports = function createRootCert() {
    const keys = forge.pki.rsa.generateKeyPair(2048);
    const cert = forge.pki.createCertificate();
    cert.publicKey = keys.publicKey;
    cert.serialNumber = '01';
    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date();
    cert.validity.notAfter.setFullYear(
        cert.validity.notBefore.getFullYear() + 20
    );

    const attrs = [
        {
            name: 'commonName',
            value: 'Localhost Root Ca No.1',
        },
        {
            name: 'countryName',
            value: 'US',
        },
        {
            shortName: 'ST',
            value: 'Virginia',
        },
        {
            name: 'localityName',
            value: 'Blacksburg',
        },
        {
            name: 'organizationName',
            value: 'localhost-cert',
        },
        {
            shortName: 'OU',
            value: 'LH',
        },
    ];
    cert.setSubject(attrs);
    cert.setIssuer(attrs);
    cert.setExtensions([
        {
            name: 'basicConstraints',
            cA: true,
        },
        {
            name: 'keyUsage',
            keyCertSign: true,
            digitalSignature: true,
            nonRepudiation: true,
            keyEncipherment: true,
            dataEncipherment: true,
        },
        {
            name: 'subjectKeyIdentifier',
        },
    ]);
    cert.sign(keys.privateKey, forge.md.sha256.create());

    // generate a server keypair
    const serverKeys = forge.pki.rsa.generateKeyPair(2048);
    const serverCert = forge.pki.createCertificate();
    serverCert.publicKey = serverKeys.publicKey;
    serverCert.serialNumber = '01';
    serverCert.validity.notBefore = new Date();
    serverCert.validity.notAfter = new Date();
    serverCert.validity.notAfter.setFullYear(
        serverCert.validity.notBefore.getFullYear() + 20
    );

    const serverAttrs = [
        {
            name: 'commonName',
            value: 'Localhost Root Ca No.1',
        },
        {
            name: 'countryName',
            value: 'US',
        },
        {
            shortName: 'ST',
            value: 'Virginia',
        },
        {
            name: 'localityName',
            value: 'Blacksburg',
        },
        {
            name: 'organizationName',
            value: 'localhost-cert',
        },
        {
            shortName: 'OU',
            value: 'LH',
        },
    ];
    serverCert.setSubject(serverAttrs);
    serverCert.setIssuer(cert.subject.attributes);
    const altNames = [
        { type: 2, value: 'localhost' },
        { type: 2, value: '*.localhost' },
        { type: 2, value: 'localhost.localdomain' },
        { type: 2, value: 'dev.local' },
        { type: 2, value: '*.dev.local' },
        { type: 2, value: '*.local' },
        { type: 2, value: '*.localdomain' },
        { type: 2, value: '*.test' },
        { type: 2, value: '*.home' },
        { type: 2, value: '*.internal' },
        { type: 2, value: '*.lan' },
        { type: 2, value: 'host.docker.internal' },
        { type: 2, value: '*.docker.internal' },
        { type: 7, value: '127.0.0.1' },
        { type: 7, value: '127.0.1.1' },
        { type: 7, value: '10.0.0.1' },
        { type: 7, value: '10.0.1.1' },
        { type: 7, value: '10.1.1.1' },
        { type: 7, value: '10.10.0.1' },
        { type: 7, value: '172.16.0.1' },
        { type: 7, value: '172.17.0.1' },
        { type: 7, value: '172.30.0.1' },
        { type: 7, value: '172.31.0.1' },
        { type: 7, value: '192.168.10.1' },
        { type: 7, value: '192.168.56.1' },
        { type: 7, value: '192.168.100.1' },
    ];

    for (let a = 0; a <= 3; a += 1) {
        for (let b = 1; b <= 255; b += 1) {
            altNames.push({
                type: 7,
                value: `192.168.${a}.${b}`,
            });
        }
    }

    for (let a = 0; a <= 255; a += 1) {
        for (let b = 1; b <= 255; b += 1) {
            altNames.push({
                type: 7,
                value: `10.0.${a}.${b}`,
            });
        }
    }

    serverCert.setExtensions([
        {
            name: 'basicConstraints',
            cA: false,
        },
        {
            name: 'keyUsage',
            digitalSignature: true,
            nonRepudiation: true,
            keyEncipherment: true,
            dataEncipherment: true,
        },
        {
            name: 'subjectAltName',
            altNames,
        },
    ]);
    serverCert.sign(keys.privateKey, forge.md.sha256.create());
    // save root certificate and key
    const rootCrt = forge.pki.certificateToPem(cert);
    const localhostCrt = forge.pki.certificateToPem(serverCert);
    const localhostKey = forge.pki.privateKeyToPem(serverKeys.privateKey);

    writeCert(
        getRootCertPath('pem'),
        forge.pki.certificateToPem(cert)
    );
    writeCert(
        getRootCertPath('crt'),
        forge.pki.certificateToPem(cert)
    );

    // save server certificate and key
    writeCert(
        getServerCertPath('crt'),
        forge.pki.certificateToPem(serverCert)
    );
    writeCert(
        getServerCertPath('key'),
        forge.pki.privateKeyToPem(serverKeys.privateKey)
    );
    console.log('certs created');
    console.log(
        `-----------------${getRootCertPath('pem')}-----------------`
    );
    console.log(rootCrt);
    console.log(`-----------------${getServerCertPath('crt')}-----------------`);
    console.log(localhostCrt);
    console.log(`-----------------${getServerCertPath('key')}-----------------`);
    console.log(localhostKey);
};
