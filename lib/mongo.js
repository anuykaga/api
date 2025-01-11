//const { url, file_restore } = require('./mongo-info.js');
/*update or backup*/
const mongoose = require('mongoose')
const { Schema } = mongoose
/*restore*/
const fs = require('fs');
const { MongoClient } = require('mongodb');
const dbName = 'test'
const collectionName = 'datas'
/* nama collection database nya default sudah datas mudah*/

class mongoDB {
   constructor(url, options = {
      useNewUrlParser: true,
      useUnifiedTopology: true
   }) {
      this.url = url
      this.data = this._data = this._schema = this._model = {}
      this.db
      this.options = options
   }
   async read() {
      this.db = await mongoose.connect(this.url, {
         ...this.options
      })
      this.connection = mongoose.connection
      let schema = this._schema = new Schema({
         data: {
            type: Object,
            required: true, //depends on whether the field is mandatory or not
            default: {}
         }
      })
      // this._model = mongoose.model('data', schema)
      try {
         this._model = mongoose.model('data', schema)
      } catch {
         this._model = mongoose.model('data')
      }
      this._data = await this._model.findOne({})
      if (!this._data) {
         this.data = {}
         await this.write(this.data)
         this._data = await this._model.findOne({})
      } else this.data = this._data.data
      return this.data
   }
   async write(data) {
      if (!data) return data
      if (!this._data) return (new this._model({
         data
      })).save()
      this._model.findById(this._data._id, (err, docs) => {
         if (!err) {
            if (!docs.data) docs.data = {}
            docs.data = data
            return docs.save()
         }
      })
   }
}


async function backup(url, _data) {
   const _db = new mongoDB(url);   
   // Membaca data dari MongoDB
   try {
      const data = await _db.read();
      //console.log('Data yang dibaca', data) //,data);
      // Menyimpan data baru
      const newData = _data//global.db // ganti dengan data yang ingin Anda simpan
      await _db.write(newData);
      // Membaca data lagi setelah penulisan
      const updatedData = await _db.read();
      let response = 'Data Berhasil Di Backup Dan DiPerbarui\n'// updatedData);
      response += 'Data has been successfully backed up'
      //console.log(response)
      return response
   } catch (e) {
      let __e = `Terjadi kesalahan Pastikan Kamu mengisi info dengan benar, termasuk alamat ip harus di atur dengan benar di pengaturan mongo (security => network access)\nerror info: \n${e}\n`
      __e += `\nAn error happens, make sure you fill out the info correctly, Including IP Address must be correct in the mongo settings (security => network access)\nerror info: \n${e}\n`      
      //console.error(__e)
      throw __e      
   } 
}
//backup();
//setInterval(main, 65_000);


async function restore(url, file_restore, opts = {}) {
    // Koneksi ke MongoDB
    const client = new MongoClient(url);
    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Mengambil semua data dari koleksi
        const documents = await collection.find({}).toArray();

        // Mengambil hanya data yang relevan dari dokumen dan menggabungkan ke dalam satu objek
        let combinedData = {};
        documents.forEach(document => {
            combinedData = { ...combinedData, ...document.data }; // Jika data ada dalam field 'data'
        });

        // Menyimpan data ke dalam file JSON
       let response = 'Data berhasil di restore ke\n' + file_restore + '\n\n'           
       if (opts.saveToFile) {
           fs.writeFileSync(file_restore, JSON.stringify(combinedData, null, 2));        
           response += 'Data successfully restored to\n' + file_restore + '\n'
        }
        //console.log(response)
        return { 
           log: opts.saveToFile ? response : 'success but not save because saveToFile : false' ,
           data: combinedData
        }
        
    } catch (e) {
        let __e = `Terjadi kesalahan Pastikan Kamu mengisi info dengan benar, termasuk alamat ip harus di atur dengan benar di pengaturan mongo (security => network access)\nerror info: \n${e}\n`
        __e += `\nAn error happens, make sure you fill out the info correctly, Including IP Address must be correct in the mongo settings (security => network access)\nerror info: \n${e} \n`      
        throw __e 
    } finally {
        await client.close();        
    }
}

//restore()

module.exports = { backup, restore }