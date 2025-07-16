import { readData, writeData } from '../../firebase.js'
export default async function(req, res) {
   const key = req.query.key;
   const url = req.query.url;
   if (!url) return await res.status(400).json({
      status: 400,
      message: "Url Tiktok Nya Mana?",
      error: "Please input url tiktok"
   });
   if (!key) return await res.status(403).json(KEY.key);
   const db = await readData();
   if (!db.keys.includes(key)) return await res.status(403).json(KEY.wrong_key);
   const user = db.users.find(user => user.authKey === key);
   if (user.limit <= 0) return await res.status(403).json(KEY.reached);
   try {
      const data = await ttdl(url);
      let log = '\nNama: tiktok\n';
      log += 'Url: ' + url + '\n';
      log += 'Status: Sukses\n';
      log += 'User: ' + user.username + '\n';
      console.log(log);
      user.limit -= 1;
      db.total_request += 1;
      await writeData(db);
      return await res.status(200).json({
         status: 200,
         request_name: user.username,
         message: 'sukses',
         data: data
      });
   } catch (e) {
      let log = '\nNama: tiktok\n';
      log += 'URL: ' + url + '\n';
      log += 'Status: Gagal\n';
      log += 'User: ' + user.username + '\n';
      console.log(log);
      db.total_request += 1;
      await writeData(db);
      return await res.status(500).json({
         status: 500,
         message: "Ada masalah, coba lagi nanti",
         error: format(e)
      })
   }
};
const address = () => {
   const octet = () => Math.floor(Math.random() * 256);
   return `${octet()}.${octet()}.${octet()}.${octet()}`;
};
const head_1 = {
   "Accept": "application/json, text/javascript, *\/*; q=0.01",
   "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
   "X-Forwarded-For": address(),
   'Custom-Port': '443',
   "Sec-CH-UA": '"Chromium";v="104", " Not A;Brand";v="99", "Google Chrome";v="104"',
   "User-Agent": "Chrome/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36"
};
const ttdl = async (url) => {
   const host = "https://www.tikwm.com";
   const data = await (await __fetch(host + "/api/", {
      method: "POST",
      headers: head_1,
      body: new URLSearchParams({
         url: url,
         count: 12,
         cursor: 0,
         web: 1,
         hd: 1
      })
   })).json();
   const region = data.data.region
   const title = data.data.title
   const avatar = host + data.data.author.avatar
   const author = data.data.author.nickname
   const username = data.data.author.unique_id
   const comment = data.data.comment_count.toLocaleString().replace(/,/g, '.');
   const cover = host + data.data.cover
   const views = data.data.play_count.toLocaleString().replace(/,/g, '.');
   const like = data.data.digg_count.toLocaleString().replace(/,/g, '.');
   const bookmark = data.data.collect_count.toLocaleString().replace(/,/g, '.');
   const create_time = data.data.create_time
   const date = new Date(create_time * 1000);
   const formatted_time = date.toLocaleDateString().replace(/,/g, '.');
   const published = formatted_time.trim();
   const video = host + data.data.play
   const video_wm = host + data.data.wmplay
   const video_hd = host + data.data.hdplay
   const music = data.data.music_info.play
   const duration = "deprecated"
   return { region, title, avatar, author, username, comment, views, cover, like, bookmark, published, video, video_wm, video_hd, music, duration };
};