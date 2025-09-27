const { Octokit } = require('@octokit/rest');
const fs = require('fs');
const { readCert } = require('./utils');
const {
    getRootCertPath,
    getServerCertPath,
} = require('./shared');
function getGitHubToken() {
    const token = process.env.GH_TOKEN;
    if (!token) {
        throw new Error('Please set the GH_TOKEN environment variable.');
    }
    return token;
}

module.exports = async function uploadToGithub() {
    const token = getGitHubToken();
    console.log(
        `[uploadToGithub] Using GitHub token with length ${token.length}. Ensure it has repo scope.`
    );
    const octokit = new Octokit({
        auth: token,
    });
    // 保存证书到本地
    async function uploadFileToGitHubRepo(
        owner,
        repo,
        filePath,
        branch,
        message
    ) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const contentEncoded = Buffer.from(fileContent).toString('base64');

        try {
            const response = await octokit.repos.createOrUpdateFileContents({
                owner: owner,
                repo: repo,
                path: filePath,
                message: message,
                content: contentEncoded,
                branch: branch,
            });
            console.log(
                'File uploaded to GitHub:',
                response.data.content.html_url
            );
        } catch (error) {
            if (error.status === 401) {
                console.error(
                    'Error uploading file to GitHub: unauthorized. Please verify GH_TOKEN has repo access or is still valid.'
                );
            } else {
                console.error('Error uploading file to GitHub:', error.message);
            }
            throw error;
        }
    }
    const rootCrt = readCert(getRootCertPath('crt'));
    const localhostCrt = readCert(getServerCertPath('crt'));
    const localhostKey = readCert(getServerCertPath('key'));
    console.log(rootCrt);
    console.log(localhostCrt);
    console.log(localhostKey);

    // 使用示例
    await uploadFileToGitHubRepo(
        'IdeaNest-org',
        'localhost-cert',
        getRootCertPath('crt'),
        'main',
        rootCrt
    );

    await uploadFileToGitHubRepo(
        'IdeaNest-org',
        'localhost-cert',
        getServerCertPath('crt'),
        'main',
        localhostCrt
    );

    await uploadFileToGitHubRepo(
        'IdeaNest-org',
        'localhost-cert',
        getServerCertPath('key'),
        'main',
        localhostKey
    );
};
