import express from 'express'
import logger from 'morgan'
import Socket from './models/socket.mjs';
import { createServer } from 'http';
import mainRouter from './routers/mainRouter.mjs'
import passport from 'passport'
import cors from 'cors'
import SES from './models/sess.mjs'
import passportConfig from './models/passport.mjs';
passportConfig(passport);

// настройка сервера
const app = express()
const httpServer = createServer(app);
Socket.init(httpServer);

// подключение модулей проекта
function setModuleMimeType(req, res, next) {
  if (req.url.endsWith('.mjs') || req.url.endsWith('.js')) {
    res.type('application/javascript');
  } else if (req.url.endsWith('.css')) {
    res.type('text/css');
  } else if (req.url.endsWith('.html')) {
    res.type('text/html');
  }  
  next();
}

// настройка портов и роутов
app.use(cors({ origin: '*', credentials: true }));
app.use(SES.getSession())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
// app.set('view engine', 'ejs')
app.use(logger('dev'))
app.use(passport.initialize());
app.use(passport.session());
app.use('/socket.io-client', express.static('node_modules/socket.io-client/dist'));
app.use("/node_modules", express.static('node_modules'))
app.use(setModuleMimeType);
app.use("/favicon.ico", express.static('public/favicon.ico'))
app.use('/css', express.static('src/front-end/css'))
app.use('/js', express.static('src/front-end/js'))
app.use('/html', express.static('src/front-end/html'))
app.use('/public', express.static('public'))
app.use('/', mainRouter)

// запуск сервера
export default (port = 3000) => {
  httpServer.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
};
