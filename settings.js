global.__fetch = (await import('node-fetch')).default;
global.format = (await import('util')).default.format;
import { readData, writeData } from './firebase.js';
import moment from 'moment-timezone'
moment.tz.setDefault("Asia/Jakarta").locale("id");
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