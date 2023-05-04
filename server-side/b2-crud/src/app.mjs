import express from 'express'
import logger from 'morgan'
import session from 'express-session'
import mainRouter from './backEnd/routers/mainRouter.mjs'
import { databaseController } from './backEnd/controllers/databaseController.mjs'

console.log('Connecting to MongoDB...')
try {
  await databaseController.connectDatabase()
} catch (err) {
  console.log('Error connecting to MongoDB', err)
}

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(session({
  cookie: {
    maxAge: 1800000
  },
  resave: false,
  saveUninitialized: true,
  secret: 'keyboard cat'
}))

app.set('view engine', 'ejs')

app.use(logger('dev'))

app.set('views', 'src/frontEnd/views')
app.use('/css', express.static('src/frontEnd/css'))
app.use('/public', express.static('public'))

app.use('/', mainRouter)

export default (port = 3000) => {
  app.listen(port, () => {
    console.log(`Server started on port ${port}`)
  })
}
