import { readData } from '../firebase.js'
import getUserProfile from "../backend/userProfile.js"
export default async function (req, res) {
    const db = await readData()
    const userProfile = await getUserProfile(req.session.email)
    if (userProfile) {        
        return await res.json({
            userProfile,
            totalUsers: Object.keys(db.users).length                      
        })
    } else {
        return await res.status(403).json({
            error: "Lu Aja Belum Login Jir"
        })
    }
}