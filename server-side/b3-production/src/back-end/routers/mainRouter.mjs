import express from 'express'
import * as dotenv from "dotenv"
import fetchRouter from './fetchRouter.mjs'
import oauthRouter from './oauthRouter.mjs'
import validator from '../middlewares/validator.mjs'

import UserController from '../controllers/userController.mjs'
import Socket from '../models/socket.mjs'

dotenv.config()
const router = express.Router()

export default router

router.get('/', (req, res) => {
  res.sendFile('/index.html', { root: 'src/front-end/html' })
})

router.get('/home', (req, res) => {
  res.redirect('/')
})


router.get('/login', (req, res) => {
  res.redirect('/')
})

router.post('/login', validator.validateLogin, UserController.login, (req, res) => {
  res.status(200)
  
})

router.post('/register', validator.validateRegister, UserController.register, (req, res) => {
  res.status(200)
  res.json(JSON.parse("User registered successfully"))
})


router.get('/logout', async (req, res) => {
  req.session.destroy()
  res.redirect('/home')
})

router.post("/webhook", validator.validateWebhook, async (req, res) => {
  console.log(req.headers)
  console.log(req.body)
  res.status(200).send('OK') 
  Socket.notify('message', req.body)
})


router.use("/auth", oauthRouter)
router.use("/get", fetchRouter)

router.get('/404', (req, res) => {
  res.sendFile('/404.html', { root: 'src/front-end/html' })
})

router.get('*', (req, res) => {
  console.log(req.url)
  res.redirect("/404")
})


