const https = require('https');
const getHttps = require('../../index');

async function main() {
    const host = process.env.HTTPS_HOST || '0.0.0.0';
    const port = Number(process.env.HTTPS_PORT) || 8443;
    const httpsConfig = await getHttps({ autoInstall: true });
    const server = https.createServer(httpsConfig, (req, res) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(
            JSON.stringify({
                ok: true,
                url: req.url,
                headers: req.headers,
            })
        );
    });

    server.listen(port, host, () => {
        console.log('HTTPS server is running.');
        console.log(`  Host: ${host}`);
        console.log(`  Port: ${port}`);
        console.log(
            `Visit https://localhost:${port} (or your chosen SAN IP) after trusting the root certificate.`
        );
    });

    const shutdown = () => {
        server.close(() => {
            console.log('HTTPS server stopped.');
            process.exit(0);
        });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
}

main().catch((err) => {
    console.error('Failed to start HTTPS server:', err);
    process.exit(1);
});

