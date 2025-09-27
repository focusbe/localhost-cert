const https = require('https');
const { tmpdir } = require('os');
const fs = require('fs');
const path = require('path');
const getHttps = require('../index');

async function main() {
    console.log('Step 1: Reading HTTPS configuration...');
    const httpsConfig = await getHttps({ autoInstall: false });
    if (!httpsConfig || typeof httpsConfig !== 'object') {
        throw new Error('HTTPS config is not an object.');
    }
    const { cert, key } = httpsConfig;
    console.log(cert, key);
    if (!cert || !cert.includes('BEGIN CERTIFICATE')) {
        throw new Error('Certificate content is invalid.');
    }
    if (!key || !key.includes('BEGIN')) {
        throw new Error('Key content is invalid.');
    }

    console.log('Step 2: Starting HTTPS server...');
    const server = https.createServer({ cert, key }, (req, res) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true }));
    });

    await new Promise((resolve, reject) => {
        server.listen(0, '127.0.0.1', (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });

    const { port } = server.address();
    console.log(`HTTPS server running on port ${port}`);

    console.log('Step 3: Performing HTTPS request...');
    await new Promise((resolve, reject) => {
        https
            .get(
                {
                    hostname: '127.0.0.1',
                    port,
                    path: '/',
                    protocol: 'https:',
                    rejectUnauthorized: false,
                },
                (res) => {
                    let data = '';
                    res.on('data', (chunk) => {
                        data += chunk;
                    });
                    res.on('end', () => {
                        try {
                            const parsed = JSON.parse(data);
                            console.log(parsed);
                            if (!parsed.ok) {
                                reject(
                                    new Error(
                                        'HTTPS response missing expected ok=true flag'
                                    )
                                );
                                return;
                            }
                            resolve();
                        } catch (err) {
                            reject(err);
                        }
                    });
                }
            )
            .on('error', reject);
    });

    server.close();
    console.log('HTTPS server verified successfully.');
}

main().catch((error) => {
    console.error('Workflow test failed:', error);
    process.exit(1);
});

