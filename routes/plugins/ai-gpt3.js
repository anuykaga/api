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
    const data = await chatbot.send(message, 'gpt-3.5-turbo')
    //console.log(data)    
    if (data) {
        res.status(200).json({
            status: 200,
            request_name: user.username,
            response: data
        })
        let log = '\nNama: GPT 3\n'
        log += 'q: ' + message + '\n'
        log += 'status: Sukses\n'    
        log += 'User: ' + user.username + '\n';
        
        console.log(log)
        user.limit -= 1;
        db.total_request += 1;
      //  await writeData(db);
        await writeData(db);
    } else if (!data) {
        res.status(500).json({
            status: 500,
            message: "Ada masalah, coba lagi nanti",
            error: '' // util.format(e)
        });
        let log = '\nNama: GPT 3\n'
        log += 'pesan: ' + message + '\n'
        log += 'Satus: Gagal\n'     
        log += 'User: ' + user.username + '\n';
        
        console.log(log)
        db.total_request += 1;
        await writeData(db);
    }
};

const chatbot = {
  send: async (message, model = "gpt-3.5-turbo") => {
    try {
      const modelx = ["gpt-3.5-turbo", "gpt-3.5-turbo-0125", "gpt-4o-mini", "gpt-4o"];
      if (!modelx.includes(model)) {
        throw new Error("Model nya kagak valid! Pilih salah satu: " + modelx.join(', '));
      }
      const payload = {
        messages: [{
          role: "user",
          content: message
        }],
        model: model
      };

      const response = await __fetch("https://mpzxsmlptc4kfw5qw2h6nat6iu0hvxiw.lambda-url.us-east-2.on.aws/process", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Postify/1.0.0'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("error:", error);
      throw error;
    }
  }
};
