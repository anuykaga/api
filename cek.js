//~ client.newsletterMetadata("invite", "0029VaSY7Lp8F2pCmQLKNn0g")

import fs from 'fs';
import path, { dirname } from 'path';
import assert from 'assert';
import { spawn } from 'child_process';
import syntaxError from 'syntax-error';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(__dirname);

// Tentukan folder yang ingin diperiksa
const folders = ['backend', 'routes', 'system', 'routes/plugins'];
let files = [];

// Membaca file dari setiap folder
for (let folder of folders) {
    const folderPath = path.join(__dirname, folder);
    if (fs.existsSync(folderPath)) {
        const fileList = fs.readdirSync(folderPath).filter(v => v.endsWith('.js') || v.endsWith('.mjs'));
        for (let file of fileList) {
            files.push(path.resolve(path.join(folderPath, file)));
        }
    }
}

// Memeriksa setiap file
for (let file of files) {
    if (file === __filename) continue;
    console.error('Checking', file);
    const error = syntaxError(fs.readFileSync(file, 'utf8'), file, {
        sourceType: 'module',
        allowReturnOutsideFunction: true,
        allowAwaitOutsideFunction: true
    });
    if (error) assert.ok(error.length < 1, file + '\n\n' + error);
    assert.ok(file);
    console.log('Done', file);
}
