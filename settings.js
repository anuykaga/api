global.__fetch = (await import('node-fetch')).default
import { readData, writeData } from './firebase.js';
import moment from 'moment-timezone'
let hasRun = false; // Flag untuk melacak apakah sudah menjalankan logika
const checkTimeAndRun = async () => {
    // Mendapatkan waktu saat ini dalam timezone Asia/Jakarta
    const now = moment.tz("Asia/Jakarta");
    const hours = now.hours();
    const minutes = now.minutes();
    const h = 23
    const m = 0
    // Cek apakah waktu adalah 23:28
    if (hours === h && minutes === m && !hasRun) {
        hasRun = true// Set flag agar tidak menjalankan lagi
        try {
            const limit = 100
            const db = await readData();
            db.users.forEach(user => {
                if (!user.premium) {
                    user.limit = limit;
                }
            });
            await writeData(db);
            let caption = `Berhasil Menambah ${limit} Limit ke setiap pengguna non-premium\n`;
            console.log(caption);
            
            setTimeout(() => {
               hasRun = false
               console.log('Worked')
               console.log(hasRun)
            }, 60_000); 
        } catch (error) {
            console.error("Terjadi kesalahan: ", error);
        }
    }
};

// Jalankan fungsi setiap 2 detik
setInterval(checkTimeAndRun, 5000);

global.KEY = {
   key: {
      //status: 403,
      message: "Masukan Apikey Nya",
      error: "Input Parameter Apikey!"
   },
   wrong_key: {
     // status: 403,
      message: "apikey salah atau tidak temukan",
      error: "wrong apikey or apikey not found"
   },
   reached: {
     // status: 403,
      message: "Ups Limit Api Key Habis",
      error: "Sorry Apikey Has Reached The Limit Please Buy To Admin Group Rhnd"
   }
}
