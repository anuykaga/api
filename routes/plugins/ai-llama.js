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
    try {
        const data = await llama(message);
        res.status(200).json({
            status: 200,
            request_name: user.username,
            data: data
        })
        let log = '\nNama: Ai lama\n'
        log += 'q: ' + message + '\n'
        log += 'status: Sukses\n'
        log += 'User: ' + user.username + '\n';
        
        console.log(log)
        user.limit -= 1;
        db.total_request += 1;
        //await writeData(db);
        await writeData(db);
    } catch (e) {
        res.status(500).json({
            status: 500,
            message: "Ada masalah, coba lagi nanti",
            error: 'no data'
        });
        let log = '\nNama: AI lama\n'
        log += 'pesan: ' + message + '\n'
        log += 'Satus: Gagal\n'
        log += 'User: ' + user.username + '\n';
        
        console.log(log)
        db.total_request += 1;
        await writeData(db);
    }
};/*
import axios from 'axios'

async function llama(text) {
    const API_KEY = 'AIzaSyC5l_pTf7TX8_fY9neywiuRJ4F20ZQzg50';
    const models = [{
            "id": 1,
            "display_name": "Llama 3.1 70B",
            "content_length": 131072
        },
        {
            "id": 2,
            "display_name": "Llama 3.1 405B",
            "content_length": 32768
        },
        {
            "id": 3,
            "display_name": "Llama 3.1 8B",
            "content_length": 131072
        },
        {
            "id": 4,
            "display_name": "Llama 3.2 3B",
            "content_length": 131072
        },
        {
            "id": 5,
            "display_name": "Llama 3.2 1B",
            "content_length": 131072
        },
        {
            "id": 6,
            "display_name": "Llama 3 70B",
            "content_length": 8192
        },
        {
            "id": 7,
            "display_name": "Llama 3 8B",
            "content_length": 8192
        },
        {
            "id": 8,
            "display_name": "Nvidia Llama-3.1-Nemotron 70B",
            "content_length": 131072
        },
        {
            "id": 9,
            "display_name": "Llama 3.1 70B Turbo",
            "content_length": 131072
        }
    ]
    const llama = {
        signUp: async function() {
            try {
                const response = await axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`, {
                    returnSecureToken: true
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept-Language': 'id-MM,id;q=0.9,ms-MM;q=0.8,ms;q=0.7,en-MM;q=0.6,en;q=0.5',
                        'Origin': 'https://chat.chat-llama.com',
                        'User-Agent': 'Postify/1.0.0'
                    }
                });
                return response.data;
            } catch (error) {
                //console.error('Sign Up otomatis gagal dilakukan, coba lagi nanti!');
                throw error;
            }
        },

        refreshToken: async function(refreshToken) {
            try {
                const response = await axios.post(`https://securetoken.googleapis.com/v1/token?key=${API_KEY}`, `grant_type=refresh_token&refresh_token=${refreshToken}`, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Accept-Language': 'id-MM,id;q=0.9,ms-MM;q=0.8,ms;q=0.7,en-MM;q=0.6,en;q=0.5',
                        'Origin': 'https://chat.chat-llama.com',
                        'User-Agent': 'Postify/1.0.0'
                    }
                });
                return response.data;
            } catch (error) {
                //console.error('Refresh token nya gak ada, coba lagi nanti !');
                throw error;
            }
        },
        chat: async function(accessToken, userInput, modelId) {
            try {
                const response = await axios.post('https://chat.chat-llama.com/chatllama/chat', {
                    model_id: modelId,
                    messages: [{
                        role: 'user',
                        content: userInput
                    }],
                    max_new_tokens: 512
                }, {
                    headers: {
                        'Authorization': accessToken,
                        'Content-Type': 'application/json',
                        'Accept-Language': 'id-MM,id;q=0.9,ms-MM;q=0.8,ms;q=0.7,en-MM;q=0.6,en;q=0.5',
                        'Origin': 'https://chat.chat-llama.com',
                        'User-Agent': 'Postify/1.0.0'
                    }
                });
                return response.data;
            } catch (error) {
                //console.error('Gak ada response dari API llama nya');
                throw error;
            }
        },
        llamaModels: function() {
            return models;
        }
    };
    async function main(msg, type) {
        try {
            // 1. Mendaftar pengguna baru
            const userData = await llama.signUp();
            //console.log('User Data:', userData);
            // 2. Dapatkan token akses dari userData jika ada
            const accessToken = userData.idToken; // Misalnya
            // 3. Menggunakan token untuk mengirim pesan ke model AI
            const response = await llama.chat(accessToken, msg, type);
            //console.log('AI Response:', response);
            // await m.reply(response)
            // 4. Jika perlu, perbarui token
            //const newTokenData = 
            await llama.refreshToken(userData.refreshToken);
            //console.log('New Token Data:', newTokenData);
            return response.replace(/\*g, '');
        } catch (error) {
            console.error('Error:', error);
        }
    };     
    return await main(text, 1)    
};
*/

async function llama(text) {
    const API_KEY = 'AIzaSyC5l_pTf7TX8_fY9neywiuRJ4F20ZQzg50';
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
        }
    }

    return await main(text, 1);
}
