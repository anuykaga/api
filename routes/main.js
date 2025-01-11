import express from 'express'
import isAuthenticated from "../system/autentikasi.mjs"
import session from "express-session"
import bodyParser from 'body-parser'
import { limit, checkBanned } from "../system/rateLimit.mjs"
let router = express.Router();
import { fileURLToPath } from 'url'
import { createRequire } from 'module' // Bring in the ability to create the 'require' method
import path, { dirname } from 'path'
const __dirname = dirname(fileURLToPath(import.meta.url));
router.use(checkBanned)
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))
router.use(session({
    secret: 'assalamualaikum',
    resave: true,
    saveUninitialized: true,
    cookie: { 
      maxAge: 86400000
    }
}))
router.get('/', limit, async (req, res) => {
    await res.sendFile(path.join(__dirname,  '../html/index.html'))
})
router.get('/docs', limit, async (req, res) => {
    await res.sendFile(path.join(__dirname, '../html/index.html'))
})
router.get("/login", limit, async (req, res) => {
    await res.sendFile(path.join(__dirname, "../html/login.html"))
})
router.get("/profile", limit, isAuthenticated, async (req, res) => {
    await res.sendFile(path.join(__dirname, "../html/profile.html"))
})
router.get("/price", limit, async (req, res) => {
    await res.sendFile(path.join(__dirname, "../html/price.html"))
})

router.post('/register', limit, async (req, res) => {
    await (await import("../system/register.mjs")).default(req, res)
})
router.post('/login', limit, async (req, res) => {
    await (await import("../system/login.mjs")).default(req, res)
})
router.get("/logout", async (req, res) => {
    await (await import("../system/logout.mjs")).default(req, res)
})
router.get("/prof", limit, isAuthenticated, async (req, res) => {
    await (await import("../system/profile.mjs")).default(req, res)
})
router.get("/ram", async (req, res) => {
    await (await import("../system/ram.mjs")).default(req, res)
})
router.get("/hit", async (req, res) => {
    await (await import("../system/total-request.mjs")).default(req, res)
})
export default router
//module.exports = router