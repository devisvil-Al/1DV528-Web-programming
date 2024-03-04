import fetch from 'node-fetch'
import Socket from '../models/socket.mjs'

// функции для запросов с клиента

// получение проектов с gitlab
export async function getProjects (req, res, next) {
  const data = await fetch(`https://gitlab.lnu.se/api/v4/groups/54572/projects?access_token=${process.env.GITLAB_API_KEY}`)
  res.json(await data.json())
}

// получение проекта c gitlab
export async function getProject (req, res, next) {
  const projectId = req.params.projectId
  const data = await fetch(`https://gitlab.lnu.se/api/v4/projects/${projectId}?access_token=${process.env.GITLAB_API_KEY}`) 
  res.json(await data.json())
}

// получение задач с gitlab
export async function getIssues (req, res, next) {
  const projectId = req.params.projectId
  const data = await fetch(`https://gitlab.lnu.se/api/v4/projects/${projectId}/issues?access_token=${process.env.GITLAB_API_KEY}`)
  res.json(await data.json())
}

// изменение задачи в gitlab
export async function editIssue (req, res, next) {
  const data = req.body
  const responceFetch = await fetch(`https://gitlab.lnu.se/api/v4/projects/40169/issues/${data.issue_iid}`, {
    method: 'PUT',
    headers: {
      'PRIVATE-TOKEN' : 'glpat-o8fHy5GcypfagLzb4t8g',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  })
  Socket.notify('message', {mod: 'issue', body: req.body})
  res.status(200).send(responceFetch)
}
