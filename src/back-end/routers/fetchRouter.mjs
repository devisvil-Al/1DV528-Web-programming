import express from 'express'
import * as dotenv from "dotenv"
import { getProjects, getProject, getIssues, editIssue } from '../controllers/fetchController.mjs'

dotenv.config()
const router = express.Router()
// роуты запросов с клиента
router.get('/projects', getProjects)
router.get('/projects/:projectId', getProject)
router.get('/issues/:projectId', getIssues)
router.post('/issue/edit', editIssue)

// router.post('/issue/delete', async (req, res) => {
//   const data = req.body
//   console.log(data);
//   const responceFetch = await fetch(`https://gitlab.lnu.se/api/v4/projects/${data.id}/issues/${data.issue_iid}`, {
//     method: 'DELETE',
//     headers: {
//       'PRIVATE-TOKEN' : 'glpat-o8fHy5GcypfagLzb4t8g',
//     },
//   })
//   console.log(responceFetch);
//   Socket.notify('message', {mod: 'issue-delete', body: req.body})
//   res.status(200).send(responceFetch)
// })

export default router


