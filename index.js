process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
process.on('uncaughtException', console.error)
import './settings.js'
import https from 'https';
import { exec } from 'child_process';
import express from 'express';
import createError from 'http-errors';
import main from './routes/main.js';
import api from './routes/api.js';
import fetch from 'node-fetch';
const app = express();
const path = process.cwd();
app.set('trust proxy', true);
app.set('json spaces', 2);
app.use(express.static('public'));
app.use('/', main);
app.use('/api', api);
app.use(async (req, res, next) => next(createError(404)));
app.use(async (err, req, res, next) => res.sendFile(path + '/html/404.html'));
async function ipAddress() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        console.log(`\n\nCurrent IP : ${data.ip}\n`);
    } catch (error) {
        console.error('Error fetching IP address:', error);
    }
};
setInterval(() => {
    exec('printf "\x1bc"', (error, stdout, stderr) => {
        console.log(stdout)
    });
}, 120_000);
const DEFAULT_PORT = 8080
const findAvailablePort = (port) => {
    return new Promise((resolve, reject) => {
        const server = app.listen(port, () => {
            server.close(() => resolve(port));
        });
        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                resolve(findAvailablePort(port + 1));
            } else {
                reject(error);
            }
        });
    });
};
findAvailablePort(DEFAULT_PORT).then((PORT) => {
   app.listen(PORT, () => {
      console.log(`\n\nServer listening on port ${PORT}\n\n`);
   });        
}).then(() => {
   ipAddress();
}).catch((error) => {
      console.error("Error finding available port:", error);
});