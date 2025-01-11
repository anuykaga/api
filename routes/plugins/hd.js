import { readData, writeData } from '../../firebase.js'
export default async function(req, res) {
  const key = req.query.key;
  const thumb = req.query.thumb
  if (!key) {
    return res.status(403).json({
      status: 403,
      message: "Masukan Apikey Nya",
      error: "Input Parameter Apikey!"
    });
  }
  if (!thumb) {
    return res.status(403).json({
       status: 403,
       message: "masukan url thumbnail atau foto nya untuk di hd kan ",
       error: "Input url thumbnail or photo to make it hd !"
     })
  }
  const db = await readData();
  if (!db.keys.includes(key)) {
    return res.status(403).json(KEY.wrong_key);
  }
  const user = db.users.find(user => user.authKey === key);
  if (user.limit <= 0) {
    return res.status(403).json(KEY.reached);
  }
  // if (Buffer.isBuffer(data)) 
  //try {
   const response = await hd(thumb)
   console.log(response)
   const data = await (await __fetch(response)).buffer()
   
    if (Buffer.isBuffer(data)) {
      res.status(200)
      res.set({
      'Content-Type': 'image/jpeg'
    })
    await res.send(data)
    let log = '\nNama: HD\n'
    log += 'url: ' + thumb + '\n'    
    log += 'result: ' + response + '\n'    
    log += 'status: Sukses\n'
    log += 'User: ' + user.username + '\n';
    
    console.log(log)
    user.limit -= 1;
    db.total_request += 1;
    await writeData(db);
    //await writeData(db);       
  } else if (!Buffer.isBuffer(data)) {
    res.status(500).json({
      status: 500,
      message: "Ada masalah, coba lagi nanti",
    });
    let log = '\nNama: HD\n'
    log += 'URL: ' + thumb + '\n'
    log += 'Satus: Gagal\n'
    log += 'User: ' + user.username + '\n';
    console.log(log)
    db.total_request += 1;
    await writeData(db);
  }
};

import FormData from 'form-node-data';

function generateRandomIP() {
    const octet = () => Math.floor(Math.random() * 254);
    return `${octet()}.${octet()}.${octet()}.${octet()}`;
}

class ImgLarger {
    constructor() {
        const baseURL = 'https://get1.imglarger.com/api/Upscaler';
        const headers = {
            'Accept': 'application/json, text/plain, */*',
            'Origin': 'https://imgupscaler.com',
            'Referer': 'https://imgupscaler.com/',
            'User-Agent': 'Postify/1.0.0',
            'Authorization': 'Bearer YOUR_API_TOKEN', // Ganti dengan token yang valid jika diperlukan
            'X-Forwarded-For': generateRandomIP()
        };

        const uploadImage = async (input, scaleRadio = 1, isLogin = 0) => {
            const formData = new FormData();

            if (typeof input === 'string') {
                if (input.startsWith('https')) {
                    try {
                        const _data = await (await __fetch(input)).buffer();
                        const bf = Buffer.from(_data);
                        formData.append('myfile', bf, {
                            filename: 'uploaded_image.jpg'
                        });
                    } catch (error) {
                        console.error(error.message);
                        throw new Error('Link gambar tidak dapat diunduh. Silakan coba lagi.');
                    }
                } else {
                    try {
                        const bf = input; // fs.readFileSync(input);
                        const fileName = Date.now() + '.png'; // path.basename(input);
                        formData.append('myfile', bf, {
                            filename: fileName
                        });
                    } catch (error) {
                        console.error(error.message);
                        throw new Error('Tidak dapat membaca Path File yang diinputkan. Silakan periksa path file-nya...');
                    }
                }
            } else if (Buffer.isBuffer(input)) {
                formData.append('myfile', input, {
                    filename: 'uploaded_image.jpg'
                });
            } else {
                throw new Error('Input tidak valid. Harap berikan path file, link gambar, atau buffer yang benar.');
            }

            formData.append('scaleRadio', scaleRadio);
            formData.append('isLogin', isLogin);

            try {
                const response = await __fetch(`${baseURL}/Upload`, {
                    method: 'POST',
                    headers: {
                        ...headers,
                        ...formData.getHeaders(),
                    },
                    body: formData,
                });

                const data = await response.json();

                if (data.code === 999) {
                    console.error('Error: ', data.msg);
                    throw new Error('Authorization ditolak. Silakan periksa akses Anda.');
                }

                return data;
            } catch (error) {
                console.error(error.message);
                throw new Error('Upload gambar gagal. Silakan periksa respons API.');
            }
        };

        const checkStatus = async (code, scaleRadio, isLogin) => {
            const payload = {
                code,
                scaleRadio,
                isLogin
            };
            try {
                const response = await __fetch(`${baseURL}/CheckStatus`, {
                    method: 'POST',
                    headers: {
                        ...headers,
                        'Content-Type': 'application/json', // Set Content-Type
                    },
                    body: JSON.stringify(payload),
                });

                if (!response.ok) {
                    const text = await response.text();
                    console.error('Error Response:', text);
                    throw new Error('Server memberikan respons tidak valid.');
                }

                const data = await response.json();
                return data;
            } catch (error) {
                console.error(error.message);
                throw new Error('Pemeriksaan status task gagal.');
            }
        };

        const processImage = async (input, scaleRadio = 1, isLogin = 0) => {
            const { data: { code } } = await uploadImage(input, scaleRadio, isLogin);
            let status;
            do {
                status = await checkStatus(code, scaleRadio, isLogin);

                if (status.data.status === 'waiting') {
                    await delay(10000);
                }
            } while (status.data.status === 'waiting');

            return status;
        };

        const delay = async (ms) => {
            return new Promise(resolve => setTimeout(resolve, ms));
        };

        // Menyimpan referensi ke fungsi sebagai properti statis
        this.uploadImage = uploadImage;
        this.checkStatus = checkStatus;
        this.processImage = processImage;
        this.delay = delay;
    }
}

async function hd(coverImagePath) {
    try {
        const _data = await (await __fetch(coverImagePath)).buffer();
        const imageUploader = new ImgLarger();
        const uploadResponse = await imageUploader.uploadImage(_data);

        const taskCode = uploadResponse.data.code;

        let status;
        do {
            status = await imageUploader.checkStatus(taskCode, 2, 0);
            if (status.data.status === 'waiting') {
                await imageUploader.delay(10000);
            }
        } while (status.data.status === 'waiting');

        const data = await status.data.downloadUrls[0];
        return data; // await conn.sendFile(m.chat, data, '', m)
    } catch (error) {
        return error;
    }
}

/*
import axios from 'axios'
import FormData from 'form-data'
//import __fetch from 'node-__fetch'
function generateRandomIP() {
    const octet = () => Math.floor(Math.random() * 254);
    return `${octet()}.${octet()}.${octet()}.${octet()}`;
}

  class ImgLarger {
    constructor() {
      this.baseURL = 'https://get1.imglarger.com/api/Upscaler';
      this.headers = {
        'Accept': 'application/json, text/plain, *`/*',
        'Origin': 'https://imgupscaler.com',
        'Referer': 'https://imgupscaler.com/',
        'User-Agent': 'Postify/1.0.0',
        'Authorization': 'Bearer YOUR_API_TOKEN', // Ganti dengan token yang valid jika diperlukan
        'X-Forwarded-For': generateRandomIP() 
      };
    }

    async uploadImage(input, scaleRadio = 2, isLogin = 0) {
      const formData = new FormData();

      if (typeof input === 'string') {
        if (input.startsWith('https')) {
          try {
            const _data = await (await ____fetch(input)).buffer()
            const bf = Buffer.from(_data);
            formData.append('myfile', bf, {
              filename: 'uploaded_image.jpg'
            });
          } catch (error) {
            console.error(error.message);
            throw new Error('Link gambar tidak dapat diunduh. Silakan coba lagi.');
          }
        } else {
          try {
            const bf = input//fs.readFileSync(input);
            const fileName = Date.now() + '.png'//path.basename(input);
            formData.append('myfile', bf, {
              filename: fileName
            });
          } catch (error) {
            console.error(error.message);
            throw new Error('Tidak dapat membaca Path File yang diinputkan. Silakan periksa path file-nya...');
          }
        }
      } else if (Buffer.isBuffer(input)) {
        formData.append('myfile', input, {
          filename: 'uploaded_image.jpg'
        });
      } else {
        throw new Error('Input tidak valid. Harap berikan path file, link gambar, atau buffer yang benar.');
      }

      formData.append('scaleRadio', scaleRadio);
      formData.append('isLogin', isLogin);

      try {
       // console.log('Sedang mengupload gambar, mohon ditunggu...');
        const response = await axios.post(`${this.baseURL}/Upload`, formData, {
          headers: {
            ...this.headers,
            ...formData.getHeaders(),
          },
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
          onUploadProgress: progressEvent => {
            this.showProgress(progressEvent.loaded, progressEvent.total);
          }
        });

        //console.log('Response dari API:', response.data);
        if (response.data.code === 999) {
          console.error('Error: ', response.data.msg);
          throw new Error('Authorization ditolak. Silakan periksa akses Anda.');
        }

       // console.log('Upload gambar selesai:', response.data);
        return response.data;
      } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        throw new Error('Upload gambar gagal. Silakan periksa respons API.');
      }
    }

    showProgress(loaded, total) {
      const percentage = Math.round((loaded / total) * 100);
     // process.stdout.write(`\rUploading: ${percentage}%\n`);
    }

    async checkStatus(code, scaleRadio, isLogin) {
      const payload = {
        code,
        scaleRadio,
        isLogin
      };
      try {
        const response = await axios.post(`${this.baseURL}/CheckStatus`, payload, {
          headers: this.headers,
        });
        return response.data;
      } catch (error) {
        console.error(error.message);
        throw new Error('Pemeriksaan status task gagal.');
      }
    }

    async processImage(input, scaleRadio = 2, isLogin = 0) {
      const {
        data: {
          code
        }
      } = await this.uploadImage(input, scaleRadio, isLogin);
      let status;
      do {
        status = await this.checkStatus(code, scaleRadio, isLogin);
       // console.log(`\nStatus task: ${status.data.status}`);

        if (status.data.status === 'waiting') {
         // console.log('Upscale image masih diproses, sabar yakk...');
          await this.delay(10000);
        }
      } while (status.data.status === 'waiting');

      //console.log('Proses selesai.');
      return status;
    }

    async delay(ms) {
      return await new Promise(resolve => setTimeout(resolve, ms));
    }
  }

async function hd(coverImagePath) {  
  try {
    const _data = await (await ____fetch(coverImagePath)).buffer()
    const imageUploader = new ImgLarger();
    const uploadResponse = await imageUploader.uploadImage(_data);
   // console.log('Hasil Upload:', uploadResponse);

    // Ambil kode dari respons upload
    const taskCode = uploadResponse.data.code;

    // Cek status pemrosesan
    let status;
    do {
      status = await imageUploader.checkStatus(taskCode, 2, 0); // Ganti scaleRadio dan isLogin jika perlu
      //console.log(`\nStatus task: ${status.data.status}`);

      if (status.data.status === 'waiting') {
      //  console.log('Upscale image masih diproses, sabar yakk...');
        await imageUploader.delay(10000); // Tunggu 5 detik sebelum cek lagi
      }
    } while (status.data.status === 'waiting');
    
    const data = await status.data.downloadUrls[0]
    return data //await conn.sendFile(m.chat, data, '', m)

  } catch (error) {
    return error
  }
}
*/

///import __fetch from 'node-____fetch';
