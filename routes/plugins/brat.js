import { readData, writeData } from '../../firebase.js'
export default async function (req, res) {
    const key = req.query.key;
    const q = req.query.q;
    if (!key) {
        return await res.status(403).json({
            status: 403,
            message: "Masukan Apikey Nya",
            error: "Input Parameter Apikey!"
        });
    }
    if (!q) {
        return await res.status(403).json(KEY.key);
    }
    const db = await readData();
    if (!db.keys.includes(key)) {
        return await res.status(403).json(KEY.wrong_key);
    }
    const user = db.users.find(user => user.authKey === key);
    if (user.limit <= 0) {
        return await res.status(403).json(KEY.reached);
    }
    // if (Buffer.isBuffer(data)) 
    try {
        const data = await (await __fetch('https://brat.caliphdev.com/api/brat?text=' + q)).buffer()        
        let log = '\nNama: Brat \n'
        log += 'url: ' + q + '\n'
        log += 'status: Sukses\n'    
        log += 'User: ' + user.username + '\n';        
        console.log(log)
        user.limit -= 1;
        db.total_request += 1;
        await writeData(db);
        res.status(200)
        res.set({
           'Content-Type': 'image/jpeg'
        })
        return await res.send(data);
    } catch (e) {        
        let log = '\nNama: brat\n'
        log += 'URL: ' + q + '\n'
        log += 'Satus: Gagal\n'    
        log += 'User: ' + user.username + '\n';        
        console.log(log)
        db.total_request += 1;
        await writeData(db);
        return await res.status(500).json({
            status: 500,
            message: "Ada masalah, coba lagi nanti\n\n" + format(e),
        });
    }
};

