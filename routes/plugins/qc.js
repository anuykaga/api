import { readData, writeData } from '../../firebase.js'
export default async function (req, res) {    
    const key = req.query.key;
    const q = req.query.q;
    const thumb = req.query.thumb;
    const name = req.query.name
    if (!key) {
        return res.status(403).json(KEY.key);
    }
    if (!q) {
        return res.status(403).json({
            status: 403,
            message: "Masuan text jya",
            error: "Input query !"
        })
    }
    if (!thumb) {
        return res.status(403).json({
            status: 403,
            message: "masukan url thumbnail atau foto nya untuk qc nya",
            error: "Input url thumbnail or photo for the qc !"
        })
    }
    if (!name) {
        return res.status(403).json({
            status: 403,
            message: "Masukan nama untuk qc nya",
            error: "Input query name for qc!"
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
    try {
        const data = await qc(thumb, name, q)
        res.status(200)
        res.set({
           'Content-Type': 'image/jpeg'
        })
        await res.send(data)
        let log = '\nNama: QC \n'
        log += 'url: ' + q + '\n'
        log += 'status: Sukses\n'        
        console.log(log)
        user.limit -= 1;
        db.total_request += 1;
        await writeData(db);
   //   await writeData(db);       
    } //else if (!Buffer.isBuffer(data))
    catch {
        res.json({
            status: 500,
            message: "Ada masalah, coba lagi nanti",
        });
        let log = '\nNama: QC\n'
        log += 'URL: ' + q + '\n'
        log += 'Satus: Gagal\n'       
        console.log(log)
        db.total_request += 1;
        await writeData(db);
    }
};



async function qc(thumb, name, q) {
    const randomColor = [
        '#ef1a11', '#89cff0', '#660000', '#87a96b', '#e9f6ff',
        '#ffe7f7', '#ca86b0', '#83a3ee', '#abcc88', '#80bd76',
        '#6a84bd', '#5d8d7f', '#530101', '#863434', '#013337',
        '#133700', '#2f3641', '#cc4291', '#7c4848', '#8a496b',
        '#722f37', '#0fc163', '#2f3641', '#e7a6cb', '#64c987',
        '#e6e6fa', '#ffa500'
    ];
    const apiColor = randomColor[Math.floor(Math.random() * randomColor.length)];
    const nama = name;

    const obj = {
        "type": "quote",
        "format": "png",
        "backgroundColor": apiColor,
        "width": 512,
        "height": 768,
        "scale": 2,
        "messages": [{
            "entities": [],
            "avatar": true,
            "from": {
                "id": 1,
                "name": name,
                "photo": {
                    "url": thumb || "https://files.catbox.moe/vrql97.jpg"
                }
            },
            "text": q,
            "replyMessage": {}
        }]
    };

    try {
        const response = await __fetch('https://bot.lyo.su/quote/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const json = await response.json();
        const buffer = Buffer.from(json.result.image, 'base64');
        return buffer;
    } catch (error) {
        console.error('Error generating quote:', error);
        throw error; // Rethrow or handle the error as needed
    }
}

