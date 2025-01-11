import { readData, writeData } from '../firebase.js'
export default async function registerUser(username, email, password, phone) {    
    const db = await readData()
    const limit = 50
    const premium = false
    const verified = false
    if (!Array.isArray(db.users)) db.users = []
    const userExists = db.users.some(user => user.email === email)
    const userExists2 = db.users.some(user => user.phone === phone)
    
    if (userExists || userExists2) {
        return {
            success: false,
            message: "Maybe the email / phone is already registered"
        }
    }
    const authKey = generateRandomString()
    db.users.push({
        username,
        email,
        phone: phone,
        password,
        limit: limit,
        authKey: authKey,
        premium: premium,
        verified: verified
    })
    //user.authKey = authKey
    db.keys.push(authKey)
    await writeData(db)
    return {
        success: true,
        message: "Registration successful!!"
    }
}

function generateRandomString(length = 6) {
    let anu = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    const anuLength = anu.length
    for (let i = 0; i < length; i++) {
        result += anu.charAt(Math.floor(Math.random() * anuLength))
    }
    return result
}
