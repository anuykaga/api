import { readData, writeData } from '../../firebase.js'
import { ytmp3 } from './youtube.js'
import { ytmp3_link } from './yt.js'
export default async function (req, res) {  
    const key = req.query.key;
    const url = req.query.url;
    if (!url) return await res.status(400).json({
            status: 400,
            message: "Url Youtube Nya Mana?",
            error: "Please input url youtube"
    })
    if (!key) return await res.status(403).json(KEY.key);
    const db = await readData();
    if (!db.keys.includes(key)) return await res.status(403).json(KEY.wrong_key);
    const user = db.users.find(user => user.authKey === key);
    if (user.limit <= 0) return await res.status(403).json(KEY.reached)    
    try {
       var data = await ytmp3(url)           
       var link = await ytmp3_link(url)
       const result = {
           ...data,  
           audio: link                        
        }        
        let log = '\nNama: ytmp3 \n'
        log += 'url: ' + url + '\n'
        log += 'status: Sukses\n'
        log += 'User: ' + user.username + '\n';        
        console.log(log)
        user.limit -= 1;
        db.total_request += 1;        
        await writeData(db);
        return await res.status(200).json({
            status: 200,
            request_name: user.username,
            message: 'sukses',
            data: result
        })
    } catch (e) {       
        let log = '\nNama: ytmp3\n'
        log += 'URL: ' + url + '\n'
        log += 'Satus: Gagal\n'
        log += 'User: ' + user.username + '\n';        
        console.log(log)
        db.total_request += 1;
        await writeData(db);
        return await res.status(500).json({
            status: 500,
            message: "Ada masalah, coba lagi nanti",
            error: format(e)
        })
    }
};