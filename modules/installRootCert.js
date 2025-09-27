const cp = require('child_process');
const process = require('process');
var sudo = require('sudo-prompt');
const path = require('path');
const { getRootCertPath } = require('./shared');
module.exports = function install() {
    // windows 运行 certutil -addstore -enterprise -f "Root" "C:\path\to\your\certificate.crt"
    // mac 运行 sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain /path/to/your/certificate.crt
    // linux 运行 sudo cp /path/to/your/certificate.crt /usr/local/share/ca-certificates/ && sudo update-ca-certificates
    // 以上命令均需要管理员权限
    try {
        const crtPath = path.resolve(__dirname, '..', getRootCertPath('crt'));
        if (process.platform === 'win32') {
            const cmd =
                'certutil -addstore -enterprise -f "Root" "' + crtPath + '"';
            var options = {
                name: 'Localhost Cert',
            };
            sudo.exec(cmd, options, function (error, stdout, stderr) {
                if (error) throw error;
            });
        } else if (process.platform === 'darwin') {
            const proce = cp.exec(
                'sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain "' +
                    crtPath +
                    '"'
            );
            proce.on('exit', function (code) {
                console.log('child process exited with code ' + code);
            });
        } else if (process.platform === 'linux') {
            cp.exec(
                'sudo cp "' +
                    crtPath +
                    '" /usr/local/share/ca-certificates/ && sudo update-ca-certificates'
            );
        } else {
            console.log('unsupport platform:' + process.platform);
        }
    } catch (error) {
        console.warn('install root certificate error:' + error);
        console.warn(
            `please download at:https://github.com/IdeaNest-org/localhost-cert/blob/main/${getRootCertPath('crt')} and install root certificate manually`
        );
    }
};
