import axios from 'axios'
import crypto from 'crypto'
const savetube = {
   api: {
      base: "https://media.savetube.me/api",
      cdn: "/random-cdn",
      info: "/v2/info",
      download: "/download"
   },
   headers: {
      'accept': '*/*',
      'content-type': 'application/json',
      'origin': 'https://yt.savetube.me',
      'referer': 'https://yt.savetube.me/',
      'user-agent': 'Postify/1.0.0'
   },
   formats: ['144', '240', '360', '480', '720', '1080', 'mp3'],
   crypto: {
      hexToBuffer: (hexString) => {
         const matches = hexString.match(/.{1,2}/g);
         return Buffer.from(matches.join(''), 'hex');
      },
      decrypt: async (enc) => {
         try {
            const secretKey = 'C5D58EF67A7584E4A29F6C35BBC4EB12';
            const data = Buffer.from(enc, 'base64');
            const iv = data.slice(0, 16);
            const content = data.slice(16);
            const key = savetube.crypto.hexToBuffer(secretKey);
            const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
            let decrypted = decipher.update(content);
            decrypted = Buffer.concat([decrypted, decipher.final()]);
            return JSON.parse(decrypted.toString());
         } catch (error) {
            throw error
         }
      }
   },
   youtube: url => {
      if (!url) return null;
      const a = [
         /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
         /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
         /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
         /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
         /youtu\.be\/([a-zA-Z0-9_-]{11})/
      ];
      for (let b of a) {
         if (b.test(url)) return url.match(b)[1];
      }
      return null
   },
   request: async (endpoint, data = {}, method = 'post') => {
      try {
         const {
            data: response
         } = await axios({
            method,
            url: `${endpoint.startsWith('http') ? '' : savetube.api.base}${endpoint}`,
            data: method === 'post' ? data : undefined,
            params: method === 'get' ? data : undefined,
            headers: savetube.headers
         })
         return {
            status: true,
            code: 200,
            data: response
         }
      } catch (error) {
         throw error
      }
   },
   getCDN: async () => {
      const response = await savetube.request(savetube.api.cdn, {}, 'get');
      if (!response.status) throw new Error(response)
      return {
         status: true,
         code: 200,
         data: response.data.cdn
      }
   },
   download: async (link, format) => {
      if (!link) {
         throw {
            status: false,
            code: 400,
            error: "Linknya mana? Yakali download kagak ada linknya 🗿"
         }
      }
      if (!format || !savetube.formats.includes(format)) {
         throw "Formatnya kagak ada bree, pilih yang udah disediain aja yak, jangan nyari yang gak ada 🗿 quality nya hanya ada 144, 240, 360, 480, 720, 1080"
            
      }
      const id = savetube.youtube(link);
      if (!id) throw 'invalid link'
      try {
         const cdnx = await savetube.getCDN();
         if (!cdnx.status) return cdnx;
         const cdn = cdnx.data;
         const result = await savetube.request(`https://${cdn}${savetube.api.info}`, {
            url: `https://www.youtube.com/watch?v=${id}`
         });
         if (!result.status) return result;
         const decrypted = await savetube.crypto.decrypt(result.data.data); var dl;
         try {
            dl = await savetube.request(`https://${cdn}${savetube.api.download}`, {
               id: id,
               downloadType: format === 'mp3' ? 'audio' : 'video',
               quality: format === 'mp3' ? '128' : format,
               key: decrypted.key
            });
         } catch (error) {
            throw error
         };
         return {
            status: true,
            code: 200,
            result: {
               title: decrypted.title || "Gak tau 🤷🏻",
               type: format === 'mp3' ? 'audio' : 'video',
               format: format,
               thumbnail: decrypted.thumbnail || `https://i.ytimg.com/vi/${id}/0.jpg`,
               download: dl.data.data.downloadUrl,
               id: id,
               key: decrypted.key,
               duration: decrypted.duration,
               quality: format === 'mp3' ? '128' : format,
               downloaded: dl.data.data.downloaded
            }
         }
      } catch (error) {
         throw error
      }
   }
};
export async function ytmp4_link(link, quality) {
	try {
		const data = await savetube.download(link, quality.toString())
		return data.result.download
	} catch (error) {
		console.error('Terjadi kesalahan:', error);
		throw error
	}
};

const ocean = async (url, format, quality) => {
   try {
      const userAgentList = [
         'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15',
         'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
         'Mozilla/5.0 (Linux; Android 10; SM-G960U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Mobile Safari/537.36'
      ];
      const apiUrl = `https://p.oceansaver.in/ajax/download.php?copyright=0&format=${format == 'mp4' ? quality : 'mp3'}&url=${url}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`;
      const downloadRequest = await axios.get(apiUrl, {
         headers: {
            'User-Agent': userAgentList[Math.floor(Math.random() * userAgentList.length)],
            'referer': 'https://y2mate.lol/en161/'
         }
      });
      if (!downloadRequest.data.success) throw new Error('Failed to initiate download.');
      const videoId = downloadRequest.data.id;
      const videoTitle = downloadRequest.data.info.title;
      const thumbnailUrl = downloadRequest.data.info.image;
      let downloadUrl = '';
      while (true) {
         const progressUrl = `https://p.oceansaver.in/ajax/progress.php?id=${videoId}`;
         const progressRequest = await axios.get(progressUrl);
         if (progressRequest.data.success && progressRequest.data.progress >= 1000) {
            downloadUrl = progressRequest.data.download_url;
            break;
         }
         await new Promise(resolve => setTimeout(resolve, 3000));
      }
      if (!downloadUrl) throw new Error('Failed to fetch download URL.');
      return {
         title: videoTitle,
         thumbnail: thumbnailUrl,
         link: downloadUrl
      };
   } catch (error) {
      throw error
   }
}
export async function ytmp3_link(link) {
	try {
		var data
		try {
		   data = await ocean(link, 'mp3')
		   return data.link
		} catch (e) {
		  try {
		     data = await savetube.download(link, 'mp3')		   
		     if (data.status) return data.result.download
		  } catch (e) {
		     throw e
		  }
		}
	} catch (error) {
		console.error('Terjadi kesalahan:', error);
		throw error
	}
};