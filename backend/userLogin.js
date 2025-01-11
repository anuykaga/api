import { readData } from '../firebase.js'
export default async function loginUser(email, password) {
    const db = await readData()
    const user = db.users.find(user => user.email === email && user.password === password)
    if (user) {
        if (!user.authKey) {
            const authKey = generateRandomString()
            user.authKey = authKey
            db.keys.push(authKey)
            await Backup(db)
        }
        return {
            success: true,
            message: "Login sukses!",
            authKey: user.authKey
        }
    } else {
        return {
            success: false,
            message: "Email or Password invalid."
        }
    }
}

const generateRandomString = (length = 6) => {
    let anu = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    const anuLength = anu.length
    for (let i = 0; i < length; i++) {
        result += anu.charAt(Math.floor(Math.random() * anuLength))
    }
    return result
}