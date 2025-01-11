import axios from 'axios'
import { CookieJar } from 'tough-cookie'
import { wrapper } from 'axios-cookiejar-support'
import cheerio from 'cheerio'
import BodyForm from 'form-node-data'

const jar = new CookieJar();
const client = wrapper(axios.create({ jar }));
const y2save = {
  baseURL: 'https://y2save.com',
  
  headers: {
    'accept': 'application/json, text/javascript, */*; q=0.01',
    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'origin': 'https://y2save.com',
    'referer': 'https://y2save.com/id',
    'user-agent': 'Postify/1.0.0',
    'x-requested-with': 'XMLHttpRequest'
  },
  
  fmt: ['mp4', 'mp3'],
  qualities: {
    mp4: ['360P', '480p', '720p', '1080p'],
    mp3: ['128kbps']
  },
  
  geToken: async function() {
    try {
      const response = await client.get(`${this.baseURL}/id`, { headers: this.headers });
      const $ = cheerio.load(response.data);
      return $('meta[name="csrf-token"]').attr('content');
    } catch (error) {
      console.log('CSRF Token nya kagak ada! manual aja yak ');
      return 'error'
     // throw error;
    }
  },
  search: async function(link) {
    try {
      const token = await this.geToken();
      const response = await client.post(`${this.baseURL}/search`, 
        `_token=${token}&query=${encodeURIComponent(link)}`,
        { headers: this.headers }
      );
      return response.data;
    } catch (error) {
      console.log('Kagak ada response 🫵');
      return 'error'//throw error;
    }
  },
  
  convert: async function(vid, key) {
    try {
      const token = await this.geToken();
      const response = await client.post(`${this.baseURL}/searchConvert`, 
        `_token=${token}&vid=${vid}&key=${encodeURIComponent(key)}`,
        { headers: this.headers }
      );
      return response.data;
    } catch (error) {
      console.log('Kagak ada response 🫵');
      return 'error'
    }
  },
  
  getfmt: function(resultx) {
    const formats = {
      mp4: resultx.data.convert_links.video.map(v => v.quality),
      mp3: resultx.data.convert_links.audio.map(a => a.quality)
    };
    return formats;
  },
  
  main: async function(link, format, quality) {
    try {
      if (!this.fmt.includes(format)) {
        return 'format not available'//throw new Error(`Formatnya kagak valid! Pilih aja salah satu: ${this.fmt.join(', ')}`);
      }
      const resultx = await this.search(link);
      if (resultx.status !== 'ok') {
        return 'falled'//throw new Error('Kagak ada 🫵');
      }
      const fmt = this.getfmt(resultx);
      let converts = format === 'mp4' ? resultx.data.convert_links.video : resultx.data.convert_links.audio;   
      var vo = converts.find(v => v.quality === quality) ||                
               converts.find(v => v.quality === '1080p') ||
               converts.find(v => v.quality === '360P')             
      const vr = await this.convert(resultx.data.vid, vo.key);
      if (vr.status !== 'ok') {
        return 'Failed'//throw new Error('Eyaaa, gagal 🫵');
      }
      return vr.dlink;
    } catch (error) {
      console.log(error);
      return ' error'
    }
  }
};
const tmp = async (buffer, opts = {}) => {
    const type = opts.ext === 'mp4' ? 'mp4' : 'mp3'
   // console.log(type)
	let form = new BodyForm();
    form.append("file", buffer, `${Date.now()}.` + type)
	try {
		var {
			data
		} = await axios({
			   url: "https://tmpfiles.org/api/v1/upload",
			   method: "POST",
			   headers: {
				  ...form.getHeaders()
			   },
			   data: form
		    })
		console.log(data)
		var ew = /https?:\/\/tmpfiles.org\/(.*)/.exec(data.data.url)
		return 'https://tmpfiles.org/dl/' + ew[1]
	} catch (e) { 
	    console.log(e)
	    return 'error'
	}
}

export async function ytmp3_link(link) {
  try {
    const format = 'mp3'; // Format yang diinginkan (mp4 atau mp3)
    const quality = '128kbps' // Kualitas yang diinginkan (misal: 360P, 480P, 720p, 1080P)
    const downloadLink = await y2save.main(link, format, quality);
   // console.log('Link unduhan:', downloadLink + '\n\n');
    //const buffer = await (await __fetch(downloadLink)).buffer()
   // await m.reply(downloadLink)
    //return await conn.sendFile(m.chat, downloadLink, '', m)
    //const data = await tmp(buffer)
    //console.log('tmp :\n' + data)
    return downloadLink 
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
    return 'Error'
  }
}

export async function ytmp4_link (link) {
  try {
    const format = 'mp4'; // Format yang diinginkan (mp4 atau mp3)
    const quality = '720p' // Kualitas yang diinginkan (misal: 360P, 480P, 720p, 1080P)
    const downloadLink = await y2save.main(link, format, quality);
   // console.log('Link unduhan:', downloadLink + '\n\n');
    //const buffer = await (await __fetch(downloadLink)).buffer()
   // await m.reply(downloadLink)
    //return await conn.sendFile(m.chat, downloadLink, '', m)
    //const data = await tmp(buffer, {ext: 'mp4'})
    //console.log('tmp :\n' + data)
    return downloadLink 
  } catch (error) {
    console.error('Terjadi kesalahan:', error.message);
    return 'Error'
  }
}
//const link = 'https://youtube.com/shorts/4O-ykhJ5Gww?si=DzzKt84u60WAue5J'; // Ganti VIDEO_ID dengan ID video YouTube yang ingin diunduh
//ytmp4(link)