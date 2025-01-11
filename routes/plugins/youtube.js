/*const got = require('got');
const { z } = require('zod');
const axios = require('axios')
const cheerio = require('cheerio')
const qs = require ('querystring');

const servers = ['en', 'id', 'es'];
const YoutubeDownloaderArgsSchema = z.object({
	0: z.string().url(),
	1: z.string().optional()
});

const YoutubeVideoOrAudioSchema = z.record(z.object({
	quality: z.string(),
	fileSizeH: z.string(),
	fileSize: z.number(),
	download: z.function().returns(z.promise(z.string().url()))
}));

const YoutubeDownloaderSchema = z.object({
	id: z.string(),
	thumbnail: z.string().url(),
	title: z.string(),
	video: YoutubeVideoOrAudioSchema,
	audio: YoutubeVideoOrAudioSchema
});

const YoutubeConvertSchema = z.string().url();

function parseFileSize(size) {
	const sized = parseFloat(size);
	return (isNaN(sized) ? 0 : sized) * (/GB/i.test(size) ?
		1000000 :
		/MB/i.test(size) ?
		1000 :
		/KB/i.test(size) ?
		1 :
		/bytes?/i.test(size) ?
		0.001 :
		/B/i.test(size) ?
		0.1 :
		0);
}*/
/*
async function convert(vid, k) {
	const json = await got('https://www.y2mate.com/mates/convertV2/index', {
		method: 'POST',
		headers: {
			accept: '/*',
			'accept-encoding': 'gzip, deflate, br',
			'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
			cookie: '_gid=GA1.2.2055666962.1683248123; _ga=GA1.1.1570308475.1683248122; _ga_K8CD7CY0TZ=GS1.1.1683248122.1.1.1683248164.0.0.0; prefetchAd_3381349=true',
			origin: 'https://www.y2mate.com',
			'User-Agent': 'SAMSUNG GT-S5282',//'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
            "X-Forwarded-For": "81.168.116.26"
		},
		form: {
			vid,
			k
		}
	}).json();
	return YoutubeConvertSchema.parse(json.dlink);
}
*/
/*
const { HttpsProxyAgent } = require('hpagent'); // Untuk menggunakan proxy

async function convert(vid, k) {
    const proxyUrl = null
    const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.37'
    const headers = {
        accept: '**',
        'accept-encoding': 'gzip, deflate, br',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'referer': 'https://www.y2mate.com/',
        'User-Agent': ua,
        'origin': 'https://www.y2mate.com',
    };

    const agent = proxyUrl ? new HttpsProxyAgent(proxyUrl) : null; // Menggunakan proxy jika disediakan

    let options = {
        method: 'POST',
        headers: headers,
        form: { vid, k },
        timeout: 3000, // Timeout 15 detik
        agent: agent,
    };


    try {
        await new Promise(resolve => setTimeout(resolve, Math.random() * 3000)); // Delay acak 0-3 detik
        const response = await got('https://www.y2mate.com/mates/convertV2/index', options);
        const json = JSON.parse(response.body);
        return await YoutubeConvertSchema.parse(json.dlink);
    } catch (error) {
        console.error("Error:", error); // Menangani error dengan lebih baik
        if (error.response) {
            console.error("Response Body:", error.response.body);
        }
        return null;
    }
}

*/

//async function youtubedl(url, server = servers[0])
/*async function youtubedl(url, server = servers[0]) {
	YoutubeDownloaderArgsSchema.parse(arguments);	
	if (!servers.includes(server)) server = servers[0];
	const json = await got
		.post(`https://www.y2mate.com/mates/analyzeV2/ajax`, {
			headers: {
				accept: '**',
				'accept-encoding': 'gzip, deflate, br',
				'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
				cookie: '_gid=GA1.2.2055666962.1683248123; _gat_gtag_UA_84863187_21=1; _ga_K8CD7CY0TZ=GS1.1.1683248122.1.1.1683249010.0.0.0; _ga=GA1.1.1570308475.1683248122',
				origin: 'https://www.y2mate.com',
				'User-Agent': 'SAMSUNG GT-S5282',//'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',				
                "X-Forwarded-For": "81.168.116.26"
			},
			form: {
				k_query: url,
				k_page: 'home',
				hl: server,
				q_auto: 0 // maybe in the future this will cause an error?
			}
		})
		.json();
	const vid = json.vid;
	const video = {};
	const audio = {};
	for (const videoKey in json.links['mp4']) {
		const _video = json.links['mp4'][videoKey];
		const quality = _video.q;
		if (_video.f !== 'mp4')
			continue;
		const fileSizeH = _video.size;
		const fileSize = parseFileSize(fileSizeH);
		video[quality] = {
			quality,
			fileSizeH,
			fileSize,
			download: convert.bind(convert, vid, _video.k)
		};
	}
	for (const audioKey in json.links['mp3']) {
		const _audio = json.links['mp3'][audioKey];
		const quality = _audio.q;
		if (_audio.f !== 'mp3')
			continue;
		const fileSizeH = _audio.size;
		const fileSize = parseFileSize(fileSizeH);
		audio[quality] = {
			quality,
			fileSizeH,
			fileSize,
			download: convert.bind(convert, vid, _audio.k)
		};
	}
	const res = {
		id: vid,
		thumbnail: `https://i.ytimg.com/vi/${vid}/0.jpg`,
		title: json.title,
		duration: json.t,
		video,
		audio
	};
	return YoutubeDownloaderSchema.parse(res);
}
*/
/*async function ytmp3(text) {
	const data = await youtubedl(text);
	const title = data.title
	const thumbnail = data.thumbnail
	const duration = data.duration
	const audio = await data.audio['128kbps'].download();	
	return {
		audio,
		title,
		thumbnail,
		title
	}
};*/
/*
###
*/
/*async function ytmp3v2(link) {
   const data = {
      url: link,
      format: 'mp3',
      lang: 'en'
   };
   const req = await axios.post('https://s40.notube.net/recover_weight.php', qs.stringify(data));
   const res = await axios.get('https://notube.net/en/download?token=' + req.data.token);
   const $ = cheerio.load(res.data);
   const id = (link.match(/watch\?v=([^\?\&\"\'>]+)/) || link.match(/embed\/([^\?\&\"\'>]+)/) || link.match(/youtu.be\/([^\?\&\"\'>]+)/) || link.match(/shorts\/([^\?\&\"\'>]+)/) || link.match(/m\.youtube\.com\/watch\?v=([^\?\&\"\'>]+)/))[1];        
   const thumbnail = `https://i.ytimg.com/vi/${id}/0.jpg`; 
   
   return {
      title: $('#breadcrumbs-section h2').text(),
      thumbnail,
      audio: $('#breadcrumbs-section #downloadButton').attr('href'),
   };
}
*/
/*
###  YTMP4
*/
/*
async function ytmp4(link) {
   let author = `Ruhend`;   
  // let title;
   let video;
   let quality;
   let size;

      let data = await youtubedl(link);
      let title = data.title;
      let thumbnail = data.thumbnail
      
      if (data.video['720p']) {
         video = await data.video['720p'].download();
         quality = await data.video['720p'].quality;
         size = await data.video['720p'].fileSizeH;
      } else if (data.video['1080p']) {
         video = await data.video['1080p'].download();
         quality = await data.video['1080p'].quality;
         size = await data.video['1080p'].fileSizeH;
      } else if (data.video['480p']) {
         video = await data.video['480p'].download();
         quality = await data.video['480p'].quality;
         size = await data.video['480p'].fileSizeH;
      } else if (data.video['360p']) {
         video = await data.video['360p'].download();
         quality = await data.video['360p'].quality;
         size = await data.video['360p'].fileSizeH;
      } else if (data.video['240p']) {
         video = await data.video['240p'].download();
         quality = await data.video['240p'].quality;
         size = await data.video['240p'].fileSizeH;
      } else if (data.video['144p']) {
         video = await data.video['144p'].download();
         quality = await data.video['144p'].quality;
         size = await data.video['144p'].fileSizeH;
      }
      
    return {
      author: author,
      title: title || '',
      video: video || '',
      quality: quality || '',
      size: size || '',
      thumbnail
     
    };
}*/
/*
async function ytmp4v2(link) {
   const data = {
      url: link,
      format: 'mp4',
      lang: 'en'
   };
   const req = await axios.post('https://s40.notube.net/recover_weight.php', qs.stringify(data));
   const res = await axios.get('https://notube.net/en/download?token=' + req.data.token);
   const $ = cheerio.load(res.data);
   const id = (link.match(/watch\?v=([^\?\&\"\'>]+)/) || link.match(/embed\/([^\?\&\"\'>]+)/) || link.match(/youtu.be\/([^\?\&\"\'>]+)/) || link.match(/shorts\/([^\?\&\"\'>]+)/) || link.match(/m\.youtube\.com\/watch\?v=([^\?\&\"\'>]+)/))[1];        
   const thumbnail = `https://i.ytimg.com/vi/${id}/0.jpg`; 
   
   return {
      title: $('#breadcrumbs-section h2').text(),
      thumbnail,
      video: $('#breadcrumbs-section #downloadButton').attr('href'),
   };
}*/


import yts from 'yt-search'
const extractVid = (data) => {
    const match = /(?:youtu\.be\/|youtube\.com(?:.*[?&]v=|.*\/))([^?&]+)/.exec(data);
    return match ? match[1] : null;
};

const info = async (id) => {
    const { title, description, url, videoId, seconds, timestamp, views, genre, uploadDate, ago, image, thumbnail, author } = await yts({ videoId: id });
    return { title, description, url, videoId, seconds, timestamp, views, genre, uploadDate, ago, image, thumbnail, author };
};
//import FormData from 'form-data'
//import { fileTypeFromBuffer } from 'file-type'
//import util from 'util'
//import fetch from 'node-fetch'

/*
const getDownloadLinks = async (id) => {
    const headers = {
        Accept: "/*",
        Origin: "https://id-y2mate.com",
        Referer: `https://id-y2mate.com/${id}`,
        'User-Agent': 'Postify/1.0.0',
        'X-Requested-With': 'XMLHttpRequest'
    };

    const response = await axios.post('https://id-y2mate.com/mates/analyzeV2/ajax', new URLSearchParams({
        k_query: `https://youtube.com/watch?v=${id}`,
        k_page: 'home',
        q_auto: 0,
    }), { headers });

    if (!response.data || !response.data.links) throw new Error('Gak ada response dari api nya 😮‍💨');

    const downloadResults = {};

    for (const [format, links] of Object.entries(response.data.links)) {
        downloadResults[format] = {};

        for (const option of Object.values(links)) {
            const res = await axios.post('https://id-y2mate.com/mates/convertV2/index', new URLSearchParams({ vid: id, k: option.k }), { headers });
            if (res.data.status !== 'ok') throw new Error('Error bree');
            
            downloadResults[format][option.q || option.f] = {
                size: option.size,
                format: option.f,
                url: res.data.dlink
            };
        }
    }

    return downloadResults;
};
*/
const search = async (query) => {
    const videos = await yts(query).then(v => v.videos);
    return videos.map(({ videoId, views, url, title, description, image, thumbnail, seconds, timestamp, ago, author }) => ({
        title, id: videoId, url,
        media: { thumbnail: thumbnail || "", image },
        description, duration: { seconds, timestamp }, published: ago, views, author
    }));
};

const YTMate = async (data) => {
    if (!data.trim()) throw new Error('Please provide query or link youtube..');
    const isLink = /youtu(\.)?be/.test(data);
    if (isLink) {
        const id = extractVid(data);
        if (!id) throw new Error('ID-nya gak ada');
        const videoInfo = await info(id);
       // const downloadLinksResult = await getDownloadLinks(id);
        return { type: 'download', download: { ...videoInfo } };
    } else {
        const videos = await search(data);
        return { type: 'search', query: data, total: videos.length, videos };
    }
}
/*
class YouTubeDownloader {
    static async downloadVideo(url, downtype, vquality) {
        const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:shorts\/|watch\?v=|music\?v=|embed\/|v\/|.+\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = url.match(regex);

        if (!match) {
            throw new Error('URL tidak valid. Silakan masukkan URL YouTube yang benar.');
        }

        const videoId = match[1];
        const data = new URLSearchParams({ videoid: videoId, downtype, vquality });

        try {
            const response = await axios.post('https://api-cdn.saveservall.xyz/ajax-v2.php', data, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            });
            return response.data.url;
        } catch (error) {
            throw new Error('Terjadi kesalahan: ' + error.message);
        }
    }
//
    static async downloadMP3(url, v = {}) {
        try {
            const mp3Link = await YouTubeDownloader.downloadVideo(url, 'mp3', v.mp3);
            return { mp3: mp3Link };
           
        } catch (error) {
            throw new Error(error.message);
        }
    }
    
    static async downloadMP4(url, v = {}) {
        try {
            const mp4Link = await YouTubeDownloader.downloadVideo(url, 'mp4', v.mp4);
           // const mp3Link = await YouTubeDownloader.downloadVideo(url, 'mp3', v.mp3);
            return { mp4: mp4Link };
           // return { mp3: mp3Link };
        } catch (error) {
            throw new Error(error.message);
        }
    }
}
*/
    /*static async search(query) {
        const url = `https://api.flvto.top/@api/search/YouTube/${encodeURIComponent(query)}`;
        try {
            const response = await axios.get(url, {
                headers: {
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
                    'Cache-Control': 'no-cache',
                    'Origin': 'https://keepvid.online',
                    'Referer': 'https://keepvid.online/',
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
                }
            });
            
            return response.data.items.map(item => ({
                ...item,
                url: `https://www.youtube.com/watch?v=${item.id}`
            }));
        } catch (error) {
            throw new Error('Gagal mengambil hasil pencarian: ' + error.message);
        }
    }*/


/*
async function ytmp4(url) { 
 try {
   const data = await YouTubeDownloader.downloadMP4(url, { mp4: '720' })
   const video = await data.mp4
   //##
   const data_mate = await YTMate(url)
   const info_mate = data_mate.download 
        
   delete require.cache[require.resolve(__filename)]
   
   return {
      title: info_mate.title || '',
      video: video || 'https://lh3.googleusercontent.com/3zkP2SYe7yYoKKe47bsNe44yTgb4Ukh__rBbwXwgkjNRe4PykGG409ozBxzxkrubV7zHKjfxq6y9ShogWtMBMPyB3jiNps91LoNH8A=s500',
      author: info_mate.author.name || '',
      description: info_mate.description || '',
      duration: info_mate.timestamp || '',
      views: info_mate.views.toLocaleString() || '',
      upload: info_mate.uploadDate || '',
      thumbnail: info_mate.thumbnail || 'https://lh3.googleusercontent.com/3zkP2SYe7yYoKKe47bsNe44yTgb4Ukh__rBbwXwgkjNRe4PykGG409ozBxzxkrubV7zHKjfxq6y9ShogWtMBMPyB3jiNps91LoNH8A=s500'      
    }
  } finally {
    delete require.cache[require.resolve(__filename)]    
  }
};

async function ytmp3(url) {   
  try {
   const data = await YouTubeDownloader.downloadMP3(url, { mp3: '128' })
   const audio = await data.mp3
   //###
   const data_mate = await YTMate(url)
   const info_mate = data_mate.download
   delete require.cache[require.resolve(__filename)]    
   return {
      title: info_mate.title || '',
      audio: audio || 'https://lh3.googleusercontent.com/3zkP2SYe7yYoKKe47bsNe44yTgb4Ukh__rBbwXwgkjNRe4PykGG409ozBxzxkrubV7zHKjfxq6y9ShogWtMBMPyB3jiNps91LoNH8A=s500',
      author: info_mate.author.name || '',
      description: info_mate.description || '',
      duration: info_mate.timestamp || '',
      views: info_mate.views.toLocaleString() || '',
      upload: info_mate.uploadDate || '',
      thumbnail: info_mate.thumbnail || 'https://lh3.googleusercontent.com/3zkP2SYe7yYoKKe47bsNe44yTgb4Ukh__rBbwXwgkjNRe4PykGG409ozBxzxkrubV7zHKjfxq6y9ShogWtMBMPyB3jiNps91LoNH8A=s500'      
   }
  } finally {    
    delete require.cache[require.resolve(__filename)];      
  }
}
*/
/*
class __video {
    constructor(url) {
        this.url = url;
        this.video = ["360", "480", "720", "1080"];
    }

    download = async(type) => {
     if (!type) {
            return {
                success: false,
                list: this.video
            }
        }
        if (!this.video.includes(type)) {
            return {
                success: false,
                list: this.video
            }
        }

        try {
            const { data } = await axios.get(`https://p.oceansaver.in/ajax/download.php?copyright=0&format=${type}&url=${this.url}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`);
            let result = {};

            while (true) {
                const response = await axios.get(`https://p.oceansaver.in/ajax/progress.php?id=${data.id}`).catch(e => e.response);
                if (response.data.download_url) {
                      result = {
                            type,
                            buffer: (await axios.get(response.data.download_url, { responseType: "arraybuffer" })).data
                        };
                    break;
                } else {
                    //console.log(`[ ! ] ${response.data.text} : ${response.data.progress}/1000`);
                }
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            return { ...data.info, ...result };
        } catch (e) {
          return {
           success: false,
           // msg: "Kode Nya Turu min Besok lagi saja", 
            err: e 
          };
        }
    }
 }

//- Example Usage
class __audio {
    constructor(url) {
        this.url = url;
        this.audio = ["mp3"];
    }

    download = async(type) => {
     if (!type) {
            return {
                success: false,
                list: this.audio
            }
        }
        if (!this.audio.includes(type)) {
            return {
                success: false,
                list: this.audio
            }
        }

        try {
            st { data } = await axios.get(`https://p.oceansaver.in/ajax/download.php?copyright=0&format=${type}&url=${this.url}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`);
            let result = {};

            while (true) {
                const response = await axios.get(`https://p.oceansaver.in/ajax/progress.php?id=${data.id}`).catch(e => e.response);
                if (response.data.download_url) {
                      result = {
                            type,
                            buffer: (await axios.get(response.data.download_url, { responseType: "arraybuffer" })).data
                            //url: response.data.download_url
                        };
                    break;
                } else {
                    //console.log(`[ ! ] ${response.data.text} : ${response.data.progress}/1000`);
                }
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            return { ...data.info, ...result };
        } catch (e) {
          return {
           success: false,
           // msg: "Kode Nya Turu min Besok lagi saja", 
            err: e 
          };
        }
    }
 }
*/
function getYouTubeVideoId(url) {
	const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|v\/|embed\/|user\/[^\/\n\s]+\/)?(?:watch\?v=|v%3D|embed%2F|video%2F)?|youtu\.be\/|youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/|youtube\.com\/playlist\?list=)([a-zA-Z0-9_-]{11})/;
	const match = url.match(regex);
	return match ? match[1] : null;
}

async function _search(teks) {
	try {
		let data = await yts(teks);
		return {
			status: true,
			
			results: data.all
		};
	} catch (error) {
		return {
			status: false,
			message: error.message
		};
	}
}




const userAgentList = [
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Linux; Android 10; SM-G960U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Mobile Safari/537.36'
];

async function exdytdl(youtubeUrl) {
    try {
        const response = await __fetch('https://contentforest.com/api/tools/youtube-video-data', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
                'Content-Type': 'application/json',
                'Origin': 'https://contentforest.com',
                'Referer': 'https://contentforest.com/tools/youtube-description-extractor',
                'User-Agent': userAgentList[Math.floor(Math.random() * userAgentList.length)]
            },
            body: JSON.stringify({
                youtube_link: youtubeUrl,
                pick_keys: ["title", "description", "shortDescription"]
            })
        });

        const data = await response.json();
        return {
            description: data.shortDescription.replace(/\n+/g, ' ').trim()
        };
    } catch (error) {
        throw error;
    }
}

async function ytdlmp4(youtubeUrl) {
    try {
        const apiUrl = `https://p.oceansaver.in/ajax/download.php?copyright=0&format=720&url=${encodeURIComponent(youtubeUrl)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`;

        const downloadRequest = await __fetch(apiUrl, {
            headers: {
                'User-Agent': userAgentList[Math.floor(Math.random() * userAgentList.length)],
                'referer': 'https://ddownr.com/'
            }
        });

        const downloadData = await downloadRequest.json();
        if (!downloadData.success) {
            return 'Failed to fetch download URL.';
        }

        const videoId = downloadData.id;
        const videoTitle = downloadData.info.title;
        const thumbnailUrl = downloadData.info.image;

        let downloadUrl = '';
        while (true) {
            const progressUrl = `https://p.oceansaver.in/ajax/progress.php?id=${videoId}`;
            const progressRequest = await __fetch(progressUrl);
            const progressData = await progressRequest.json();
            
            if (progressData.success && progressData.progress >= 1000) {
                downloadUrl = progressData.download_url;
                break;
            }
            await new Promise(resolve => setTimeout(resolve, 10000));
        }

        if (!downloadUrl) {
            return 'Failed to fetch download URL.';
        }

        const descriptionData = await exdytdl(youtubeUrl);
        return {
            title: videoTitle,
            thumbnail: thumbnailUrl,
            description: descriptionData.description,
            link: downloadUrl
        };

    } catch (error) {
        console.log('Error: ' + error);
        throw error;
    }
}


async function ytmp4(url) {   
  try {
   //const is_video = (await ytdlmp4(url)).link
   //console.log(is_video)
   //const buffer = await (await fetch(is_video)).buffer()   
   //console.log(buffer)
   //const vidURL = await upload(buffer)
   const data_mate = await YTMate(url)
   const info_mate = data_mate.download
   return {
      title: info_mate.title || '',
      //video: is_video || 'https://lh3.googleusercontent.com/3zkP2SYe7yYoKKe47bsNe44yTgb4Ukh__rBbwXwgkjNRe4PykGG409ozBxzxkrubV7zHKjfxq6y9ShogWtMBMPyB3jiNps91LoNH8A=s500',
      author: info_mate.author.name || '',
      description: info_mate.description || '',
      duration: info_mate.timestamp || '',
      views: info_mate.views.toLocaleString() || '',
      upload: info_mate.uploadDate || '',
      thumbnail: info_mate.thumbnail || 'https://lh3.googleusercontent.com/3zkP2SYe7yYoKKe47bsNe44yTgb4Ukh__rBbwXwgkjNRe4PykGG409ozBxzxkrubV7zHKjfxq6y9ShogWtMBMPyB3jiNps91LoNH8A=s500'      
   }
  } catch (e) {
     return e.toString()
  }
}
async function ytdlmp3(youtubeUrl) {
    try {
        const apiUrl = `https://p.oceansaver.in/ajax/download.php?copyright=0&format=mp3&url=${encodeURIComponent(youtubeUrl)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`;

        const downloadRequest = await __fetch(apiUrl, {
            headers: {
                'User-Agent': userAgentList[Math.floor(Math.random() * userAgentList.length)],
                'referer': 'https://ddownr.com/'
            }
        });

        const downloadData = await downloadRequest.json();
        if (!downloadData.success) {
            return 'Failed to fetch download URL.';
        }

        const videoId = downloadData.id;
        const videoTitle = downloadData.info.title;
        const thumbnailUrl = downloadData.info.image;

        let downloadUrl = '';
        while (true) {
            const progressUrl = `https://p.oceansaver.in/ajax/progress.php?id=${videoId}`;
            const progressRequest = await __fetch(progressUrl);
            const progressData = await progressRequest.json();
            
            if (progressData.success && progressData.progress >= 1000) {
                downloadUrl = progressData.download_url;
                break;
            }
            await new Promise(resolve => setTimeout(resolve, 10000));
        }

        if (!downloadUrl) {
            return 'Failed to fetch download URL.';
        }

        const descriptionData = await exdytdl(youtubeUrl);
        return {
            title: videoTitle,
            thumbnail: thumbnailUrl,
            description: descriptionData.description,
            link: downloadUrl
        };

    } catch (error) {
        console.log('Error: ' + error);
        throw error;
    }
}

async function ytmp3(url) {   
  try {
  // const is_audio = (await ytdlmp3(url)).link
   //const AUDIO = is_audio//await (await axios.get(is_audio, { responseType: "arraybuffer" })).data
   //console.log(AUDIO)
   //const audio = await (await data.download('mp3')).buffer
   //console.log(audio)
   //###
   const data_mate = await YTMate(url)
   const info_mate = data_mate.download
   return {
      title: info_mate.title || '',
      //audio: is_audio || 'https://lh3.googleusercontent.com/3zkP2SYe7yYoKKe47bsNe44yTgb4Ukh__rBbwXwgkjNRe4PykGG409ozBxzxkrubV7zHKjfxq6y9ShogWtMBMPyB3jiNps91LoNH8A=s500',
      author: info_mate.author.name || '',
      description: info_mate.description || '',
      duration: info_mate.timestamp || '',
      views: info_mate.views.toLocaleString() || '',
      upload: info_mate.uploadDate || '',
      thumbnail: info_mate.thumbnail || 'https://lh3.googleusercontent.com/3zkP2SYe7yYoKKe47bsNe44yTgb4Ukh__rBbwXwgkjNRe4PykGG409ozBxzxkrubV7zHKjfxq6y9ShogWtMBMPyB3jiNps91LoNH8A=s500'      
   }
  } catch (e) {
     return e
  } 
}

export { ytmp3 , ytmp4 }
