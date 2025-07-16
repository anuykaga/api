import { readData } from '../firebase.js'
export default async function (req, res) {
    const db = await readData();
    let total_request = db.total_request ? db.total_request + 352615 : 325615;    
    total_request = total_request.toLocaleString('en-US').replace(/,/g, '.');
    return await res.json({
        total_request: total_request
    });
};
