import * as dotenv from 'dotenv'
dotenv.config()

const validator = {}

// валидация webhook
validator.validateWebhook = (req, res, next) => {
  console.log(process.env.GITLAB_SECRET_TOKEN);
  if (req.headers['x-gitlab-token'] === process.env.GITLAB_SECRET_TOKEN) {
    next()
  } else {
    res.status(403).send('Invalid token')
  }
}

export default validator


