import loginUser from "../backend/userLogin.js"
export default async function (req, res) {
    const {
        email,
        password                
    } = req.body
    const result = await loginUser(email, password)
    //console.log(result)
    if (result.success) {
        req.session.email = email
        req.session.password = password
        return await res.json({
            success: true,
            message: "Login sukses!"
        })
    } else {
        return await res.json(result)
    }
}