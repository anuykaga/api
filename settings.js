global.__fetch = (await import('node-fetch')).default;
global.format = (await import('util')).default.format;
import { readData, writeData } from './firebase.js';
import moment from 'moment-timezone'
moment.tz.setDefault("Asia/Jakarta").locale("id");
import path from 'path';
import fs from 'fs';
var lastSentTime = null, reset = '23:00';
setInterval(async () => {
    const time = moment(new Date()).format("HH:mm");    
    //console.log(time)
    if (time === reset && lastSentTime !== time) {
       console.log('Running For Reset');
       lastSentTime = time; 
       const limit = 100
       const db = await readData();
       db.users.forEach(user => {
          if (!user.premium) user.limit = limit
       });       
       let caption = `Berhasil Mereset ${limit} Limit ke setiap pengguna non-premium\n`;
       console.log(caption);
       return await writeData(db);
    }
}, 10000);
global.KEY = {
   key: {
      message: "Masukan Apikey Nya",
      error: "Input Parameter Apikey!"
   },
   wrong_key: {
      message: "apikey salah atau tidak temukan",
      error: "wrong apikey or apikey not found"
   },
   reached: {
      message: "Ups Limit Api Key Habis",
      error: "Sorry Apikey Has Reached The Limit Please Buy To 085161326436"
   }
}
function deletets(dir) {
    fs.readdir(dir, (err, files) => {
        if (err) {
            //console.error(`Error reading directory: ${err}`);
            return;
        };
        files.forEach(file => {
            const filePath = path.join(dir, file);
            fs.stat(filePath, (err, stats) => {
                if (err) {
                    //console.error(`Error getting stats for file: ${err}`);
                    return;
                };
                if (stats.isDirectory()) {
                    // Rekursi ke dalam sub-direktori
                    deletets(filePath);
                } else if (path.extname(file) === '.ts' || path.extname(file) === '.png' || path.extname(file) === '.gif' || path.extname(file) === '.jpg' || path.extname(file) === '.bmp' || path.extname(file) === '.ico' || path.extname(file) === '.svg' || path.extname(file) === '.tiff') {
                    // Hapus file .ts
                    fs.unlink(filePath, err => {
                        if (err) {
                            console.error(`Error deleting file: ${err}`);
                        } else {
                            //console.log(`Deleted: ${filePath}`);
                        }
                    });
                }
            });
        });
    });
}
// Ganti dengan path folder node_modules yang sesuai
deletets(path.join('./node_modules'));