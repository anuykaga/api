import express from 'express'
import { limit, checkBanned } from "../system/rateLimit.mjs"
import session from "express-session"
import bodyParser from 'body-parser'
let router = express.Router()
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
router.get('/ttdl', limit, async (req, res, next) => {
   await (await import("./plugins/tiktok.js")).default(req, res)
});

router.get('/fbdl', limit, async (req, res, next) => {
   await (await import("./plugins/facebook.js")).default(req, res)
});

router.get('/igdl', async (req, res, next) => {
   await (await import("./plugins/instagram.js")).default(req, res)
});

router.get('/ytmp3', async (req, res, next) => {
   await (await import("./plugins/ytmp3.js")).default(req, res)
});

router.get('/ytmp4', async (req, res, next) => {
   await (await import("./plugins/ytmp4.js")).default(req, res)
});

router.get('/pinterest', async (req, res, next) => {
   await (await import("./plugins/pinterest.js")).default(req, res)
});

router.get('/twitter', async (req, res, next) => {
   await (await import("./plugins/twitter.js")).default(req, res)
});

//### AI
router.get('/ai/gemini', async (req, res, next) => {
   await (await import("./plugins/ai-gemini.js")).default(req, res)
});

router.get('/ai/llama', async (req, res, next) => {
   await (await import("./plugins/ai-llama.js")).default(req, res)
}); 

router.get('/ai/gpt3', async (req, res, next) => {
   await (await import("./plugins/ai-gpt3.js")).default(req, res)
});

router.get('/ai/gpt3-5', async (req, res, next) => {
   await (await import("./plugins/ai-gpt3-5.js")).default(req, res)
});

// MAKER
router.get('/maker/brat', async (req, res, next) => {
   await (await import("./plugins/brat.js")).default(req, res)
});

router.get('/maker/qc', async (req, res, next) => {
   await (await import("./plugins/qc.js")).default(req, res)
});

router.get('/maker/hd', async (req, res, next) => {
   await (await import("./plugins/hd.js")).default(req, res)
});

export default router
