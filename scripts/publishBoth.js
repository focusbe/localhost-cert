#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const packages = ['localhost-https', 'localhost-cert'];
const projectRoot = path.resolve(__dirname, '..');
const pkgJsonPath = path.join(projectRoot, 'package.json');
const pkgLockPath = path.join(projectRoot, 'package-lock.json');
const npmToken = process.env.NPM_TOKEN || process.env.NODE_AUTH_TOKEN;

if (!npmToken) {
    console.error(
        'Missing npm authentication token. Please configure NPM_TOKEN or NODE_AUTH_TOKEN.'
    );
    process.exit(1);
}

console.log(
    `Detected npm auth token with length ${npmToken.length}; proceeding with publish.`
);

const originalPackageJson = fs.readFileSync(pkgJsonPath, 'utf-8');
const originalPackageLock = fs.existsSync(pkgLockPath)
    ? fs.readFileSync(pkgLockPath, 'utf-8')
    : null;

function writeJson(filePath, content) {
    fs.writeFileSync(filePath, JSON.stringify(content, null, 4) + '\n');
}

function updatePackageName(name) {
    const packageJson = JSON.parse(originalPackageJson);
    packageJson.name = name;
    writeJson(pkgJsonPath, packageJson);

    if (originalPackageLock) {
        const packageLock = JSON.parse(originalPackageLock);
        packageLock.name = name;
        if (packageLock.packages && packageLock.packages['']) {
            packageLock.packages[''].name = name;
        }
        writeJson(pkgLockPath, packageLock);
    }
}

function restoreOriginalFiles() {
    fs.writeFileSync(pkgJsonPath, originalPackageJson);
    if (originalPackageLock) {
        fs.writeFileSync(pkgLockPath, originalPackageLock);
    }
}

function publishPackage(name) {
    console.log(`Publishing ${name}...`);
    updatePackageName(name);
    execSync('npm publish --access public', {
        stdio: 'inherit',
        env: {
            ...process.env,
            npm_config_registry: 'https://registry.npmjs.org/',
            NODE_AUTH_TOKEN: npmToken,
        },
        cwd: projectRoot,
    });
}

try {
    packages.forEach(publishPackage);
    console.log('All packages published successfully.');
} finally {
    restoreOriginalFiles();
}

