import express from 'express'
import isAuthenticated from "../system/autentikasi.mjs"
import session from "express-session"
import bodyParser from 'body-parser'
import { limit, checkBanned } from "../system/rateLimit.mjs"
import { fileURLToPath } from 'url'
import { createRequire } from 'module' // Bring in the ability to create the 'require' method
import path, { dirname } from 'path'
const __dirname = dirname(fileURLToPath(import.meta.url));
const router = express.Router();
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
}));
const v = '../html/';
router.get('/', limit, async (req, res) => await res.sendFile(path.join(__dirname, v + 'index.html')))
router.get('/docs', limit, async (req, res) => await res.sendFile(path.join(__dirname, v + 'index.html')))
router.get("/login", limit, async (req, res) => await res.sendFile(path.join(__dirname, v + 'login.html')))
router.get("/profile", limit, isAuthenticated, async (req, res) => await res.sendFile(path.join(__dirname, v + 'profile.html')))
router.get("/price", limit, async (req, res) => await res.sendFile(path.join(__dirname, v + 'price.html')))

const $ = '../system/';
router.post('/register', limit, async (req, res) => await (await import($ + 'register.mjs')).default(req, res))
router.post('/login', limit, async (req, res) => await (await import($ + 'login.mjs')).default(req, res))
router.get("/logout", async (req, res) => await (await import($ + 'logout.mjs')).default(req, res))
router.get("/prof", limit, isAuthenticated, async (req, res) => await (await import($ + 'profile.mjs')).default(req, res))
router.get("/ram", async (req, res) => await (await import($ + 'ram.mjs')).default(req, res))
router.get("/hit", async (req, res) => await (await import($ + 'total-request.mjs')).default(req, res))

export default router