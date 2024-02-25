import * as dotenv from 'dotenv'

dotenv.config()

const validator = {}

export default validator


validator.validateWebhook = (req, res, next) => {
  if (req.headers['x-gitlab-token'] === process.env.GITLAB_SECRET_TOKEN) {
    next()
  } else {
    res.status(403).send('Invalid token')
  }

}

validator.validateRegister = (req, res, next) => {

  const { firstName, lastName, email, password } = req.body

  if (!firstName) {
    res.status(400)
    res.json('Please enter your first name') 
    
    return
  }
  if (!lastName) {
    res.status(400)
    res.json('Please enter your last name')
    return
  }
  if (!email) {
    res.status(400)
    res.json('Please enter your email address')
    return
  }
  if (!email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
    res.status(400)
    res.json('Please enter a valid email address')
    return
  }
  if (!password) {
    res.status(400)
    res.json('Please enter a password')
    return
  }

  if (password.length < 8) {
    res.status(400)
    res.json('Password must be at least 8 characters long')
    return
  }

  if (!password.match(/[A-Z]/)) {
    res.status(400)
    res.json('Password must contain at least one uppercase letter')
    return
  }
  req.user = req.body
  req.user.provider = 'local'
  next()
}

validator.validateLogin = (req, res, next) => {

  const { email, password } = req.body

  if (!email) {
    res.status(400)
    res.json('Please enter your email address')
    return
  }
  if (!email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
    res.status(400)
    res.json('Please enter a valid email address')
    return
  }
  if (!password) {
    res.status(400)
    res.json('Please enter a password')
    return
  }

  req.user = req.body
  req.user.provider = 'local'
  next()
}


validator.validateToken = async (req, res, next) => {

  req.sessionStore.all((err, sessions) => {
    if (err) {
      res.status(500).json({message: "Internal server error"})
    }
    // console.log(sessions)
    for (const session in sessions) {
      if (sessions[session].user) {
        if (sessions[session].user.token === req.body.token) {
          req.session.user = sessions[session].user 
          console.log(req.session.user)        
          next()
          return
        }
      }

    }
    res.status(401).json({message: "Invalid credentials"})
  })

}


