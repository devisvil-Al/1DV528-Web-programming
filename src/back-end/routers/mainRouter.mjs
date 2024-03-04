import express from 'express'
import * as dotenv from "dotenv"
import fetchRouter from './fetchRouter.mjs'
import oauthRouter from './oauthRouter.mjs'
import validator from '../middlewares/validator.mjs'
import Socket from '../models/socket.mjs'

dotenv.config()
const router = express.Router()

export default router

// роуты по умолчанию
router.get('/', (req, res) => {
  res.sendFile('/index.html', { root: 'src/front-end/html' })
})

router.get('/home', (req, res) => {
  res.redirect('/')
})

router.get('/projects', (req, res) => {
  res.sendFile('/index.html', { root: 'src/front-end/html' })
})

router.get('/projects/*', (req, res) => {
  res.sendFile('/index.html', { root: 'src/front-end/html' })
})

// роуты webhook
router.post("/webhook", validator.validateWebhook, async (req, res) => {
  res.status(200).send('OK') 
  Socket.notify('message', req.body)
})

router.use("/auth", oauthRouter)
router.use("/get", fetchRouter)






