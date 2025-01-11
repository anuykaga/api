import { readData, writeData } from '../../firebase.js'
export default async function (req, res) {
    const key = req.query.key;
    const message = req.query.q
    if (!message) {
        return res.status(403).json({
            status: 403,
            message: "Masukan Texnya",
            error: "Please input The Text"
        })
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
    const data = await (await __fetch('https://rayhanzuck.vercel.app/api/ai/gemini?text=' + message)).json()
    //console.log(data)
    if (data.status) {
        res.status(200).json({
            status: 200,
            request_name: user.username,
            data: data.result
        })
        let log = '\nNama: Ai Gemini\n'
        log += 'q: ' + message + '\n'
        log += 'status: Sukses\n'     
        log += 'User: ' + user.username + '\n';        
        console.log(log)
        user.limit -= 1;
        db.total_request += 1;
        //await writeData(db);
        await writeData(db);
    } else if (!data.status) {
        res.status(500).json({
            status: 500,
            message: "Ada masalah, coba lagi nanti",
            error: '' // util.format(e)
        });
        let log = '\nNama: AI Gemini\n'
        log += 'pesan: ' + message + '\n'
        log += 'Satus: Gagal\n'     
        log += 'User: ' + user.username + '\n';        
        console.log(log)
        db.total_request += 1;
        await writeData(db);
    }
};