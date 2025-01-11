import { readData, writeData } from '../../firebase.js'
export default async function (req, res) {    
    const key = req.query.key;
    const q = req.query.q;    
    if (!q) {
        return res.status(400).json({
            status: 400,
            message: "Masukan yext / query yang ingin dicari!",
            error: "Input query that you wanna search!"
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
    const data = await pinterest(q)
    if (Object.keys(data).length > 1) {
        res.status(200).json({
            status: 200,
            request_name: user.username,
            message: 'sukses',
            data: data
        })
        let log = '\nNama: pinterest \n'
        log += 'url: ' + q + '\n'
        log += 'status: Sukses\n'
        
        console.log(log)
        user.limit -= 1;
        db.total_request += 1;
        //await writeData(db);
        await writeData(db);
    } else {
        res.status(500).json({
            status: 500,
            message: "Ada masalah, coba lagi nanti",
            error: data
        });
        let log = '\nNama: pinterest\n'
        log += 'URL: ' + q + '\n'
        log += 'Satus: Gagal\n'       
        console.log(log)
        db.total_request += 1;
        await writeData(db);
    }
};


import cheerio from 'cheerio';

async function pinterest(query) {
    try {
        const response = await __fetch('https://id.pinterest.com/search/pins/?autologin=true&q=' + query, {
            headers: {
                "cookie": "_auth=1; _b=\"AYOGl5LYEFlLXZDKYKXKCMyEf/yNAUOtXVQlc7vwy9VKhNc+7AWLw8TRHuN9lK05mgA=\"; _pinterest_sess=TWc9PSZhb2pyNlBYUk8zQ1IzWlRtZWdHbGxXMXNzQXVrWWdFdjNxcXN2eW5LUEUrbVJKMkM4R09sK01BYnhuNytNMS9aSzhmRlAyeVE3UUZWV3k4ckZUWWtGN1YxL0F1UEl5WmZDaUVlaS9teWpXNzArS2NBcVlkYnpML0h4UHA5VEg3UDhJRWFJUDZTT1lETFRIVWdkdG9BWTRveWpHWTdOREVleEo3RDhkcW84SDNmS2RSN3JQdy8rTkJvQk9BRDdVZm9WdTZSalpmNWVHYVM3NENXM1BDbGdjUWpNQlIzZXNuRnA1MG9qcnVPNUx1QjAyNjVyZlRkMkdtM01BYVIzdWZ4c0V3L3FYU1MyQUQ1SmRkUThYSWpVZXkxMVRIaVlQSGxBcGU2c2p3eEYzdElTdTVta3gzazBhOGZzOFhlMzR6ZjVhSWRITmU4d2pLSTlTL0MxZGFVelFibXRyc3YyY0o2QldhNitjQkh4R2xwNnk4Z0VmMEpHeGpPN2krMzZpb1ZSVG5XRUI4Ui9ueHNUY0ZITFJidnBadXNWVkdRREdNS2FYTzJvK29IZXRNWVBqQzZZOFRTVFllUDdSbWhIMThWTkNwaUc5bDh4cFFxV2xKNWcrRHpQREFWMGo2QStvQ3FUQTh5VUxWZHJ6M3hIREJWVTk3UFRZaEF1WDVCQ1RsRzdUNVZ2VTQwOHE4V3N3NlJKby9nSjZJVFUzL3o4cXlzK1YwNkdDN1NFWGEzQ3V6NGNZQ2FvcUxYVzdtUnZ4NTBadGppdUFSZTE0bXRMbVEyWW5VYWJwQUI3TExLc3FoZGlIZVR4SjZJWEtYZnFoMkQyRWl6YnF4OEowTDlPTVo2NjA3M0oxMURxSCswamNINkFvRXdOTHlYQmxwT0Z0NENpQkw3QnUzazRtVnlQRytkZ1JjT0xZSjFqQW43MG4raHNueU5MNTRlcEgyUWx6bmVLOWF2N1k0am16VkNEWStZWXBFaWYzRncyUC82SE1rcldlaUFQb0psOUt2K2xGNWZySDkvZTMrK1NwZVgxb0loK0xYTW5oL2Rvb3JCSHBXOHlla3dnQkNoOWdaM0lUeWt0TFRhZnE4YzQ4TVBkTmNRdVdvQW9qZ1JqOXhxN2o1aHlGa09zc1ZHVVBKYXNDdzZ2V2xQVFZKaVl3MCtPOXY1QXFLeGxjZFFJSVRRa2tlYW8vRnRTdkZYYTdJaTE1VmhRNnEzdUVXNG9QN0tSQi9KbCtnNTVJSTZDUXR6dXhVR1FHZTdmaUJNZ2dseTR2TlFOV0pzOFpmY1VJUklsUmRvWVVES0JzOFpYS0dlWnV0dU4zUWFSM2ptbnZoVTdHYWtQOW5wcGltNjFMempUODEwZG9XQ052VkExdEdSUDRSR1N2SnkxRmVvdlF4aUp3dDdPNTdkWTJlMCtVUkdDZjZwWFFmQTVXTHNCMG1vcFVBeEtUWUlTS2RjMzh3RTZINTdPUm1BSW5XRUMzek9LNnFiZERKUHg5NXNjZFhKUHdZb0g4NDUzZDFEWms1S1hXK3d6Y01HeTZwWVBvYzY0UlgxMmx2OFNEek1vZjM0N1E3Z1grZDVhTUFJc0Qyc1Jydi93VklwaGY2NEtNdUFXNGJPdlFmMXM2cTA0S2d3NU53Yi9MTWJnRXp5STNyTVAzTFBoc3RQejd6M0FQNXAyVkcxZ1kwbnZWbTcvQVY0Q1BRcnlNbnhUVXFjdTliWVNBNXh0bEhsK2Z4QzhCWDAvcEpLTExlcFNSSjYyYWF2ZU40WFBnSFNjellsRHFDQlVuRjEmY3dUNDlRZWY4NHNjY2NqUFJnVnVLd09oQUxFPQ==; _ir=0"
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.text();
        const $ = cheerio.load(data);
        const result = [];
        const hasil = [];

        $('div > a').get().map(b => {
            const link = $(b).find('img').attr('src');
            result.push(link);
        });

        result.forEach(v => {
            if (v == undefined) return;
            hasil.push(v.replace(/236/g, '736'));
        });

        hasil.shift(); // Remove the first element if needed
        return hasil;
    } catch (error) {
        console.error('Error fetching Pinterest:', error);
        return [];
    }
}

// Example usage
