export default async function isAuthenticated(req, res, next) {
    if (req.session && req.session.email) {
        return await next()
    } else {
        return await res.redirect("/login")
    }
}
