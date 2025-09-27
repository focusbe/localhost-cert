const cp = require('child_process');
const process = require('process');
var sudo = require('sudo-prompt');
const path = require('path');
const { getRootCertPath } = require('./shared');

module.exports = async function install() {
    return new Promise((resolve, reject) => {
        // windows 运行 certutil -addstore -enterprise -f "Root" "C:\path\to\your\certificate.crt"
        // mac 运行 sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain /path/to/your/certificate.crt
        // linux 运行 sudo cp /path/to/your/certificate.crt /usr/local/share/ca-certificates/ && sudo update-ca-certificates
        // 以上命令均需要管理员权限
        try {
            const crtPath = path.resolve(__dirname, '..', getRootCertPath('crt'));
            if (process.platform === 'win32') {
                const cmd =
                    'certutil -addstore -enterprise -f "Root" "' + crtPath + '"';
                const options = {
                    name: 'Localhost Cert',
                };
                sudo.exec(cmd, options, function (error) {
                    if (error) {
                        console.error('Failed to run command:', cmd);
                        reject(error);
                        return;
                    }
                    resolve();
                });
            } else if (process.platform === 'darwin') {
                const darwinCmd =
                    'sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain "' +
                    crtPath +
                    '"';
                const proce = cp.exec(darwinCmd);
                proce.on('exit', function (code) {
                    console.log('child process exited with code ' + code);
                    if (code !== 0) {
                        console.error('Failed to run command:', darwinCmd);
                        reject(new Error('install root cert failed'));
                        return;
                    }
                    resolve();
                });
                proce.on('error', (err) => {
                    console.error('Failed to run command:', darwinCmd);
                    reject(err);
                });
            } else if (process.platform === 'linux') {
                const linuxCmd =
                    'sudo cp "' +
                    crtPath +
                    '" /usr/local/share/ca-certificates/ && sudo update-ca-certificates';
                cp.exec(linuxCmd, (error) => {
                    if (error) {
                        console.error('Failed to run command:', linuxCmd);
                        reject(error);
                        return;
                    }
                    resolve();
                });
            } else {
                const message = 'unsupport platform:' + process.platform;
                console.log(message);
                resolve();
            }
        } catch (error) {
            console.warn('install root certificate error:' + error);
            console.warn(
                `please download at:https://github.com/IdeaNest-org/localhost-cert/blob/main/${getRootCertPath('crt')} and install root certificate manually`
            );
            reject(error);
        }
    });
};
