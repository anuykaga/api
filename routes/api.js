import express from 'express'
import { limit, checkBanned } from "../system/rateLimit.mjs"
import session from "express-session"
import bodyParser from 'body-parser'

const router = express.Router()
const $ = './plugins/'

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

// - DOWNLOADER MENU - \\
router.get('/ttdl', async (req, res) => await (await import($ + 'tiktok.js')).default(req, res));
router.get('/fbdl', async (req, res) => await (await import($ + 'facebook.js')).default(req, res));
router.get('/igdl', async (req, res) => await (await import($ + 'instagram.js')).default(req, res));
router.get('/ytmp4', async (req, res) => await (await import($ + 'ytmp4.js')).default(req, res));
router.get('/ytmp3', async (req, res) => await (await import($ + 'ytmp3.js')).default(req, res));
router.get('/pinterest', async (req, res) => await (await import($ + 'pinterest.js')).default(req, res));
router.get('/twitter', async (req, res) => await (await import($ + 'twitter.js')).default(req, res));

//### AI
router.get('/ai/gemini', async (req, res) => await (await import($ + 'ai-gemini.js')).default(req, res))
router.get('/ai/llama', async (req, res) => await (await import($ + 'ai-llama.js')).default(req, res))
router.get('/ai/gpt3', async (req, res) => await (await import($ + 'ai-gpt3.js')).default(req, res))
router.get('/ai/gpt3-5', async (req, res) => await (await import($ + 'ai-gpt3-5.js')).default(req, res))

// MAKER
router.get('/maker/brat', async (req, res) => await (await import($ + 'brat.js')).default(req, res))
router.get('/maker/qc', async (req, res) => await (await import($ + 'qc.js')).default(req, res))
router.get('/maker/hd', async (req, res) => await (await import($ + 'hd.js')).default(req, res))

export default router
