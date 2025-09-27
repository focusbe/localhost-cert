
# Localhost Https / Localhost Cert

## A secure and convenient solution for enabling HTTPS on localhost

## Other languages
[chinese](readme.zh_CN.md)

### When to use Localhost Cert?

If you need to enable HTTPS when starting a local development server, then Localhost Cert is the tool you need. It allows you to quickly obtain pre-generated certificates.

### Is it necessary to install the root certificate?

Similar to most proxy tools, you still need to install the root certificate. This is because Localhost Cert uses a self-signed certificate, which is not trusted by default in browsers. Although installing the root certificate locally is safe.

### Why adopt it across the team?

- When everyone relies on `localhost-cert`, you can share the same HTTPS setup when starting local servers—no more regenerating certificates per project or teammate.
- Especially for open-source projects, adopting this approach means contributors immediately benefit from the shared root certificate without extra setup.
- Need additional hostnames or internal IP addresses in the SAN list? Open an issue or send a PR so the whole community benefits.

### Included SAN coverage

Localhost Cert ships with a subjectAltName list tailored for common development setups:
- DNS entries: `localhost`, `*.localhost`, `localhost.localdomain`, `dev.local`, `*.dev.local`, `*.local`, `*.localdomain`, `*.test`, `*.home`, `*.internal`, `*.lan`, `host.docker.internal`, `*.docker.internal`.
- Loopback and RFC1918 IPs: `127.0.0.1`, `127.0.1.1`, `10.0.0.1`, `10.0.1.1`, `10.1.1.1`, `10.10.0.1`, `172.16.0.1`, `172.17.0.1`, `172.30.0.1`, `172.31.0.1`, `192.168.10.1`, `192.168.56.1`, `192.168.100.1`.
- Full ranges: every address in `192.168.0.x`, `192.168.1.x`, and `192.168.3.x` (i.e. `192.168.{0,1,3}.1-255`).

This balance keeps the certificate broadly useful while staying within browser/OpenSSL size limits. If you need additional entries, please open an issue or PR so we can discuss expanding the list responsibly.

### Why is it secure?

If you have a basic understanding of HTTPS, you know that installing a CA root certificate locally can be risky. This is because the root certificate can be used to sign any domain, such as google.com, enabling man-in-the-middle attacks. However, Localhost Cert immediately discards the private key of the root certificate after generating the localhost domain certificate. Therefore, it is impossible for anyone to use this root certificate to sign other websites.

To ensure that the private key is not remembered, Localhost Cert utilizes GitHub Actions to generate the root certificate. The process of generating the certificate and the code at that time are fully traceable on GitHub. If you're interested, you can view the [GitHub Action](https://github.com/IdeaNest-org/localhost-cert/actions/runs/7056302734) for more details.

In summary, it is completely secure due to two reasons:
1. The process of generating the root certificate is based on GitHub Actions and is fully traceable.
2. After signing the localhost domain, the private key of the root certificate is discarded and cannot be used to sign other domains.

### How to use?

```bash
npm install localhost-cert --save-dev
```

#### webpack-dev-server

```javascript
const getHttps = require('localhost-cert');

// webpack config
module.exports = {
    devServer: {
        https: getHttps(),
    },
};
```

```javascript
// vite config
const getHttps = require('localhost-cert');
export default defineConfig({
    server: {
        https: getHttps(),
    },
});
```
### License

Localhost Cert is licensed under the MIT License.