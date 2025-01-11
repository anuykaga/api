import { readData, writeData } from '../../firebase.js'
export default async function (req, res) {    
    const key = req.query.key;
    const url = req.query.url;
    if (!url) {
        return res.status(400).json({
            status: 400,
            message: "Url Tiktok Nya Mana?",
            error: "Please input url tiktok"
        });
    }
    if (!key) {
        return res.status(403).json(KEY.key);
    }
    const db = await readData();
    if (!db.keys.includes(key)) {
        return res.status(403).json(KEY.wrong_key);
    }
    const user = db.users.find(user => user.authKey === key);
    if (user.limit <= 0) {
        return res.status(403).json(KEY.reached);
    }
    try {        
        const data = await ttdl(url);
        res.status(200).json({
            status: 200,
            request_name: user.username,
            message: 'sukses',
            data: data
        });
        let log = '\nNama: tiktok\n';
        log += 'Url: ' + url + '\n';
        log += 'Status: Sukses\n';
        log += 'User: ' + user.username + '\n';
        
        console.log(log);
        user.limit -= 1;
        db.total_request += 1;
        await writeData(db);
    } catch (e) {
        res.status(500).json({
            status: 500,
            message: "Ada masalah, coba lagi nanti",
            error: e
        });       
        let log = '\nNama: tiktok\n';
        log += 'URL: ' + url + '\n';
        log += 'Status: Gagal\n';
        log += 'User: ' + user.username + '\n';
        
        console.log(log);
        db.total_request += 1;
        await writeData(db);
    }
};

function generateRandomIP() {
    const octet = () => Math.floor(Math.random() * 254);
    return `${octet()}.${octet()}.${octet()}.${octet()}`;
}

async function ttdl(url) {
    try {
        let host = "https://www.tikwm.com";
        let res = await __fetch(host + "/api/", {
            method: "POST",
            headers: {
                Accept: "application/json, text/javascript, *\/*; q=0.01",
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "X-Forwarded-For": generateRandomIP(),
                'Custom-Port': '443',
                "Sec-CH-UA": '"Chromium";v="104", " Not A;Brand";v="99", "Google Chrome";v="104"',
                "User-Agent": "Chrome/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36"
            },
            body: new URLSearchParams({
                url: url,
                count: 12,
                cursor: 0,
                web: 1,
                hd: 1
            })
        });
        let data = await res.json();
        let region = data.data.region
        let title = data.data.title
        let avatar = host + data.data.author.avatar
        let author = data.data.author.nickname
        let username = data.data.author.unique_id
        let comment = data.data.comment_count.toLocaleString();
        let cover = host + data.data.cover
        let views = data.data.play_count.toLocaleString();
        let like = data.data.digg_count.toLocaleString();
        let bookmark = data.data.collect_count.toLocaleString();
        let create_time = data.data.create_time
        let date = new Date(create_time * 1000);
        let formatted_time = date.toLocaleDateString();
        let published = formatted_time.trim();
        let video = host + data.data.play
        let video_wm = host + data.data.wmplay
        let video_hd = host + data.data.hdplay
        let music = data.data.music_info.play
        let duration = ""
        return {
            region,
            title,
            avatar,
            author,
            username,
            comment,
            views,
            cover,
            like,
            bookmark,
            published,
            video,
            video_wm,
            video_hd,
            music,
            duration
        }
    } catch (e) {
        throw 'something gone wrong'
    }
}