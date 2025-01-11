//const fs = require('fs');
//const db = JSON.parse(fs.readFileSync('./database.json'));
import { readData } from '../firebase.js'
export default async function getUserProfile(email) {
    const db = await readData()
    const user = db.users.find(user => user.email === email)
    if (user) {
        return {
            username: user.username,
            email: user.email,
            authKey: user.authKey,
            limit: user.limit,
            premium: user.premium,
            verified: user.verified,
            phone: user.phone
        }
    } else {
        return 'Profile Tidak Di Temukan'
    }
}
