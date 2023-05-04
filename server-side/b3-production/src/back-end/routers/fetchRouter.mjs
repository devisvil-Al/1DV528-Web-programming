import express from 'express'
import * as dotenv from "dotenv"
import validator from '../middlewares/validator.mjs'

dotenv.config()
const router = express.Router()


router.get('/projects', async (req, res) => {
  // var data = await fetch(`https://gitlab.lnu.se/api/v4/projects/31166/issues?access_token=${process.env.GITLAB_API_KEY}`)
  var data = await fetch(`https://gitlab.lnu.se/api/v4/groups/42700/projects?access_token=${process.env.GITLAB_API_KEY}`)
  data = await data.json()
  res.json(data)
})

router.get('/projects/:projectId', async (req, res) => {
  const projectId = req.params.projectId
  var data = await fetch(`https://gitlab.lnu.se/api/v4/projects/${projectId}?access_token=${process.env.GITLAB_API_KEY}`)
  data = await data.json()
  res.json(data)
})

router.get('/issues/:projectId', async (req, res) => {
  const projectId = req.params.projectId
  var data = await fetch(`https://gitlab.lnu.se/api/v4/projects/${projectId}/issues?access_token=${process.env.GITLAB_API_KEY}`)
  data = await data.json()
  res.json(data)
})

router.post('/user-info', validator.validateToken, async (req, res) => {
  console.log(req.session.user)
  res.status(200).json({user : req.session.user.user})
})

router.post('/subscribed-projects', validator.validateToken, async (req, res) => {


})

export default router


