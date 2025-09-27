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
            value: 'localhost-cert Root CA (IdeaNest)',
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
            value: 'IdeaNest Localhost Cert',
        },
        {
            shortName: 'OU',
            value: 'Localhost Certificate Authority',
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
    serverCert.serialNumber = '02';
    serverCert.validity.notBefore = new Date();
    serverCert.validity.notAfter = new Date();
    serverCert.validity.notAfter.setFullYear(
        serverCert.validity.notBefore.getFullYear() + 20
    );

    const serverAttrs = [
        {
            name: 'commonName',
            value: 'localhost-cert Server (IdeaNest)',
        },
        {
            name: 'organizationName',
            value: 'IdeaNest Localhost Cert',
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
        { type: 7, ip: '127.0.0.1' },
        { type: 7, ip: '127.0.1.1' },
        { type: 7, ip: '10.0.0.1' },
        { type: 7, ip: '10.1.1.1' },
        { type: 7, ip: '172.16.0.1' },
        { type: 7, ip: '172.17.0.1' },
        { type: 7, ip: '172.30.0.1' },
        { type: 7, ip: '172.31.0.1' },
        { type: 7, ip: '192.168.0.1' },
        { type: 7, ip: '192.168.1.1' },
        { type: 7, ip: '192.168.3.81' },
        { type: 7, ip: '192.168.10.1' },
    ];

    [0, 1, 3].forEach((a) => {
        for (let b = 1; b <= 255; b += 1) {
            altNames.push({
                type: 7,
                ip: `192.168.${a}.${b}`,
            });
        }
    });

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
    // console.log(rootCrt);
    console.log(`-----------------${getServerCertPath('crt')}-----------------`);
    console.log(localhostCrt);
    console.log(`-----------------${getServerCertPath('key')}-----------------`);
    console.log(localhostKey);
};
