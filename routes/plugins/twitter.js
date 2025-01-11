import { readData, writeData } from '../../firebase.js'
export default async function (req, res) {    
    const key = req.query.key;
    const url = req.query.url;    
    if (!url) {
        return res.status(403).json({
            status: 403,
            message: "Url Twiter Nya Mana?",
            error: "Please input url twiter"
        })
    }
    if (!key) {
        return res.status(403).json(KEY.key);
    }
    const db = await readData();
    if (!db.keys.includes(key)) {
        return res.status(403).json(KEY.wrong_key);;
    }
    const user = db.users.find(user => user.authKey === key);
    if (user.limit <= 0) {
        return res.status(403).json(KEY.reached);
    }
    const data = await downloadTwitter(url)
    console.log(Object.keys(data).length)
    if (Object.keys(data.title).length > 1) {
        res.status(200).json({
            status: 200,
            request_name: user.username,
            message: 'sukses',
            data: data
        })
        let log = '\nNama:twitter \n'
        log += 'url: ' + url + '\n'
        log += 'status: Sukses\n'
        log += 'User: ' + user.username + '\n';
        
        console.log(log)
        user.limit -= 1;
        db.total_request += 1;
      //  await writeData(db);
        await writeData(db);
    } else if (Object.keys(data.title).length == 0) {
        res.status(500).json({
            status: 500,
            message: "Ada masalah, coba lagi nanti",
            error: data
        });
        let log = '\nNama: twitter\n'
        log += 'URL: ' + url + '\n'
        log += 'Satus: Gagal\n'     
        log += 'User: ' + user.username + '\n';
        
        console.log(log)
        db.total_request += 1;
        await writeData(db);
    }
};

import qs from 'qs';
import cheerio from 'cheerio';

async function downloadTwitter(link) {
    try {
        const requestBody = { URL: link };
        const response = await __fetch("https://twdown.net/download.php", {
            method: 'POST',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                'sec-ch-ua': "\" Not;A Brand\";v=\"99\", \"Google Chrome\";v=\"91\", \"Chromium\";v=\"91\"",
                'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': "_ga=GA1.2.1900411916.1734314599; _gid=GA1.2.2029947738.1734314599; __gads=D=d728a7a6b8c8f8d9:T=1734314601:RT=1734314601:S=ALNI_MYEh4_dy0Gk75uJmd4GHWspRa8c-A; _gat=1"
            },
            body: qs.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.text();
        const cheerioObject = cheerio.load(data);
        const title = cheerioObject("div:nth-child(1) > div:nth-child(2) > p").text().trim();
        const hdUrl = cheerioObject("tbody > tr:nth-child(1) > td:nth-child(4) > a").attr('href');
        const sdUrl = cheerioObject("tr:nth-child(2) > td:nth-child(4) > a").attr("href");

        return {
            title: title,
            url: {
                hd: hdUrl,
                sd: sdUrl
            }
        };
    } catch (error) {
        console.error('Error downloading Twitter video:', error);
        throw error; // Rethrow or handle the error as needed
    }
}

