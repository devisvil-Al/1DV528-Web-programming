import express from 'express'
import snippetRouter from './snippetRouter.mjs'
import { UserController } from '../controllers/userController.mjs'

import { validator } from '../middlewares/validator.mjs'
import { sessionHandler } from '../middlewares/sessionHandler.mjs'

const router = express.Router()

export default router

router.get('/', sessionHandler.home)

router.get('/home', sessionHandler.home)

router.get('/login', sessionHandler.login)

router.post('/login', validator.login, UserController.login, sessionHandler.home)

router.get('/register', validator.isOkToRegister, sessionHandler.register)

router.post('/register', validator.register, UserController.register, sessionHandler.login)

router.use('/snippet', snippetRouter)

router.get('/logout', sessionHandler.logout)

router.get('*', sessionHandler.else)
