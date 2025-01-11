global.__fetch = (await import('node-fetch')).default
import { readData, writeData } from './firebase.js';
let hasRun = false; // Flag untuk melacak apakah sudah menjalankan logika
const checkTimeAndRun = async () => {
    const moment = (await import('moment-timezone')).default
    // Mendapatkan waktu saat ini dalam timezone Asia/Jakarta
    const now = moment.tz("Asia/Jakarta");
    const hours = now.hours();
    const minutes = now.minutes();
    const h = 23
    const m = 0
    // Cek apakah waktu adalah 23:28
    if (hours === h && minutes === m && !hasRun) {
        hasRun = true; // Set flag agar tidak menjalankan lagi
        try {
            const limit = 50
            const db = await readData();
            db.users.forEach(user => {
                if (!user.premium) {
                    user.limit = limit;
                }
            });
            await writeData(db);
            let caption = `Berhasil Menambah ${limit} Limit ke setiap pengguna non-premium\n`;
            console.log(caption);
        } catch (error) {
            console.error("Terjadi kesalahan: ", error);
        }
    } else if (hours === h && minutes !== m) {
        hasRun = false; // Reset flag jika sudah lewat menit yang ditentukan
    }
};

// Jalankan fungsi setiap 2 detik
setInterval(checkTimeAndRun, 1000);

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
