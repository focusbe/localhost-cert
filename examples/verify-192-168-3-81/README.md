# Verify HTTPS for 192.168.3.81

This example launches an HTTPS server using `localhost-cert`. You can then open the endpoint from a browser or CLI (after trusting the root certificate) to validate that `192.168.3.81` is covered by the SAN list.

## Usage

```bash
node examples/verify-192-168-3-81/index.js
```

The script listens on `0.0.0.0:8443` by default (override with `HTTPS_HOST`/`HTTPS_PORT`). Once running, visit:

```
https://192.168.3.81:8443
```

If the certificate is trusted and includes that IP, you should see a JSON payload similar to:

```json
{"ok":true,"url":"/","headers":{...}}
```

If the connection fails, double-check that the latest root certificate is installed and that the SAN list still contains `192.168.3.81`.

