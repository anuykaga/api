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
    }
    try {
        const data = await llama(message);        
        let log = '\nNama: Ai lama\n'
        log += 'q: ' + message + '\n'
        log += 'status: Sukses\n'
        log += 'User: ' + user.username + '\n';        
        console.log(log)
        user.limit -= 1;
        db.total_request += 1;
        //await writeData(db);
        await writeData(db);
        return await res.status(200).json({
            status: 200,
            request_name: user.username,
            data: data
        })
    } catch (e) {        
        let log = '\nNama: AI lama\n'
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
async function llama(text) {
    const API_KEY = 'AIzaSyDxufK6S_YLLP8oAEVJ1bd-_Lduh8GJ5ho';
    const models = [
        { "id": 1, "display_name": "Llama 3.1 70B", "content_length": 131072 },
        { "id": 2, "display_name": "Llama 3.1 405B", "content_length": 32768 },
        { "id": 3, "display_name": "Llama 3.1 8B", "content_length": 131072 },
        { "id": 4, "display_name": "Llama 3.2 3B", "content_length": 131072 },
        { "id": 5, "display_name": "Llama 3.2 1B", "content_length": 131072 },
        { "id": 6, "display_name": "Llama 3 70B", "content_length": 8192 },
        { "id": 7, "display_name": "Llama 3 8B", "content_length": 8192 },
        { "id": 8, "display_name": "Nvidia Llama-3.1-Nemotron 70B", "content_length": 131072 },
        { "id": 9, "display_name": "Llama 3.1 70B Turbo", "content_length": 131072 }
    ];
    const llama = {
        signUp: async function() {
            try {
                const response = await __fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept-Language': 'id-MM,id;q=0.9,ms-MM;q=0.8,ms;q=0.7,en-MM;q=0.6,en;q=0.5',
                        'Origin': 'https://chat.chat-llama.com',
                        'User-Agent': 'Postify/1.0.0'
                    },
                    body: JSON.stringify({ returnSecureToken: true })
                });
                return await response.json();
            } catch (error) {
                throw error;
            }
        },
        refreshToken: async function(refreshToken) {
            try {
                const response = await __fetch(`https://securetoken.googleapis.com/v1/token?key=${API_KEY}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Accept-Language': 'id-MM,id;q=0.9,ms-MM;q=0.8,ms;q=0.7,en-MM;q=0.6,en;q=0.5',
                        'Origin': 'https://chat.chat-llama.com',
                        'User-Agent': 'Postify/1.0.0'
                    },
                    body: `grant_type=refresh_token&refresh_token=${refreshToken}`
                });
                return await response.text();
            } catch (error) {
                throw error;
            }
        },
        chat: async function(accessToken, userInput, modelId) {
            try {
                const response = await __fetch('https://chat.chat-llama.com/chatllama/chat', {
                    method: 'POST',
                    headers: {
                        'Authorization': accessToken,
                        'Content-Type': 'application/json',
                        'Accept-Language': 'id-MM,id;q=0.9,ms-MM;q=0.8,ms;q=0.7,en-MM;q=0.6,en;q=0.5',
                        'Origin': 'https://chat.chat-llama.com',
                        'User-Agent': 'Postify/1.0.0'
                    },
                    body: JSON.stringify({
                        model_id: modelId,
                        messages: [{ role: 'user', content: userInput }],
                        max_new_tokens: 512
                    })
                });
                const responseText = await response.text(); // Ambil respons sebagai teks
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status} - ${responseText}`);
                }
                // Coba mengonversi ke JSON
                try {
                    const data = responseText
                    return data;
                } catch (jsonError) {
                    throw new Error(`Invalid JSON response: ${responseText}`);
                }
            } catch (error) {
                console.error('Error in chat function:', error);
                throw error;
            }
        },
        llamaModels: function() {
            return models;
        }
    };
    async function main(msg, type) {
        try {
            const userData = await llama.signUp();
            const accessToken = userData.idToken; // Dapatkan token akses
            const response = await llama.chat(accessToken, msg, type);
            await llama.refreshToken(userData.refreshToken);
            const before = response.replace(/\*/g, '');
            const after = before.toString()
            return after
        } catch (error) {
            console.error('Error:', error);
            throw error
        }
    };
    return await main(text, 1);
}
