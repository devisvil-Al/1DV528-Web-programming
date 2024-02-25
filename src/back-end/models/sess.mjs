import session from 'express-session'


const SES = {}

SES.session = session({
  cookie: {
    maxAge: 1800000
  }, 
  resave: false,
  saveUninitialized: true,
  secret: 'keyboard cat'
})

SES.memoryStore = new session.MemoryStore(SES.session);

SES.getMemoryStore = () => {
  return SES.memoryStore
}

SES.getSession = () => {
  return SES.session
}


export default SES
