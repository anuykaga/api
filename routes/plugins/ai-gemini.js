import { readData, writeData } from '../../firebase.js'
export default async function (req, res) {
    const key = req.query.key;
    const message = req.query.q
    if (!message) {
        return await res.status(403).json({
            status: 403,
            message: "Masukan Texnya",
            error: "Please input The Text"
        })
    }
    if (!key) {
        return await res.status(403).json(KEY.key);
    }
    const db = await readData();
    if (!db.keys.includes(key)) {
        return await res.status(403).json(KEY.wrong_key);
    }
    const user = db.users.find(user => user.authKey === key);
    if (user.limit <= 0) {
        return await res.status(403).json(KEY.reached);
    };    
    try {       
        let data = await gemini(message);
        let log = '\nNama: Ai Gemini\n'
        log += 'q: ' + message + '\n'
        log += 'status: Sukses\n'     
        log += 'User: ' + user.username + '\n';        
        console.log(log)
        user.limit -= 1;
        db.total_request += 1;        
        await writeData(db);
        return await res.status(200).json({
            status: 200,
            request_name: user.username,
            data: data
        })
    } catch (e) {        
        let log = '\nNama: AI Gemini\n'
        log += 'pesan: ' + message + '\n'
        log += 'Satus: Gagal\n'     
        log += 'User: ' + user.username + '\n';        
        console.log(log)
        db.total_request += 1;
        await writeData(db);
        return await res.status(500).json({
            status: 500,
            message: "Ada masalah, coba lagi nanti",
            error: format(e)
        });
    }
};

async function gemini(text) {
	try {
	const keys = (await (await fetch('https://files.catbox.moe/aa22ob.json')).json())[0]
	const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + keys
	const data = {
		contents: [{
			parts: [{
				text
			}]
		}]
	};
	const respon = await (await __fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	})).json();
	// Mengambil teks dari respons
	const message = respon.candidates[0].content.parts[0].text.replace(/\n+/g, '\n\n').replace(/\*/g, '').trim();
	console.log(message)
	return message
	} catch {
	   throw 'Gemini Sedang Error Coba Lagi Di Lain Waktu !'
	}
}