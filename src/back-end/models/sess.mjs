import session from 'express-session'
const SES = {}

// контроль сессии
SES.session = session({
  cookie: {
    maxAge: 1800000
  }, 
  resave: false,
  saveUninitialized: true,
  secret: 'keyboard cat'
})

SES.memoryStore = new session.MemoryStore(SES.session);
SES.getMemoryStore = () => SES.memoryStore
SES.getSession = () => SES.session

export default SES
