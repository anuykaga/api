import admin from 'firebase-admin'
import fs from 'fs'
import fetch from 'node-fetch'
const serviceAccount = await (await fetch("https://files.catbox.moe/37tqcj.json")).json()
const databaseURL = "wss://rest-api-312d1-default-rtdb.firebaseio.com";
const path = "/data";
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: databaseURL
})
//await readData()
//await writeData(JSON.parse(fs.readFileSync('data.json')))
//await readData()
async function readData() {
  try {    
    const _db = await admin.database();
    const ref = await _db.ref(path);
    const snapshot = await ref.once('value');
    const response = JSON.parse(snapshot.val()); // Pastikan response adalah objek
    if (response && response.users) {      
      //fs.writeFileSync('data.json', JSON.stringify(response, 0, 2))
      console.log('R √');
      return response; 
    } else {
      console.log('Tidak ada data pengguna yang ditemukan.');      
    }
  } catch (error) {
    console.error('Terjadi kesalahan saat membaca data:', error);
  }
};

async function writeData(data) {
  try {         
    const JsonData = JSON.parse(JSON.stringify(data));
    const jsonData = JSON.stringify(JsonData)     
    const db = await admin.database();
    const ref = await db.ref(path);   
    await ref.set(jsonData);
    console.log('W √');
  } catch (error) {
    console.error('Terjadi kesalahan saat menulis data:', error);
  }
};
export { writeData, readData }