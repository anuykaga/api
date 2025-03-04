import yts from 'yt-search'
const extractVid = (data) => {
    const match = /(?:youtu\.be\/|youtube\.com(?:.*[?&]v=|.*\/))([^?&]+)/.exec(data);
    return match ? match[1] : null;
};

const info = async (id) => {
    const { title, description, url, videoId, seconds, timestamp, views, genre, uploadDate, ago, image, thumbnail, author } = await yts({ videoId: id });
    return { title, description, url, videoId, seconds, timestamp, views, genre, uploadDate, ago, image, thumbnail, author };
};
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

async function ytmp4(url) {   
  try {   
   const data_mate = await YTMate(url)
   const info_mate = data_mate.download
   return {
      title: info_mate.title || '',
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
   const data_mate = await YTMate(url)
   const info_mate = data_mate.download
   return {
      title: info_mate.title || '',
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
