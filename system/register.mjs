import registerUser from "../backend/userRegis.js"
export default async function (req, res) {
    const {
        username,
        email,
        password,
        phone
    } = req.body
    const result = await registerUser(username, email, password, phone)
    //console.log(result)
    if (result.success) {
        req.session.email = email
        req.session.phone = phone
        res.json({
            success: true,
            message: "Register sukses!"
        })
        //res.send( "Register Sukses!")
        //res.redirect("/profile")   
    } else {
        res.json(result)
    }
}