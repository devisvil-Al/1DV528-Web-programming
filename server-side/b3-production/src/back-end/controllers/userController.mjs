// the controller for user

import model  from '../models/user.mjs'

import {v4 as uuidv4} from 'uuid'

export const UserController = {}

export default UserController


UserController.register = async (req, res, next) => {

  const user = await model.register(req.user)

  console.log("HERE IN THE USERCONTROLLER")

  if (user instanceof Error) {
    const js = JSON.parse(user.message)
    res.status(js.status)
    res.json(js.message)
    return
  }

  next()

}

UserController.login = async (req, res, next) => {
  const user = await model.login(req.user)

  if (user instanceof Error) {
    const js = JSON.parse(user.message)
    console.log(js.status)
    res.status(js.status)
    res.json(js.message)
    return
  }

  const js = {message: "User logged in successfully", token: uuidv4(), user: user.firstName + " " + user.lastName}

  req.session.user = js
  req.session.user.id = user.id

  console.log("user logged in successfully")

  if (req.query.state) {
    res.redirect("/?" + JSON.stringify(js))
  }
  console.log(js)
  res.status(200).json(js)

}

UserController.getSubscribedProjects = async (req, res) => {

  const user = await model.getSubscribedProjects(req.session.user.id)

  if (user instanceof Error) {
    const js = JSON.parse(user.message)
    res.status(js.status)
    res.json(js.message)
    return
  }

  res.status(200).json(user)
}

UserController.subscribeToProject = async (req, res) => {
  
  const user = await model.subscribeToProject(req.session.user.id, req.body.projectId)

  if (user instanceof Error) {
    const js = JSON.parse(user.message)
    res.status(js.status)
    res.json(js.message)
    return
  }

  res.status(200)
}

UserController.unsubscribeToProject = async (req, res) => {
    
  const user = await model.unsubscribeFromProject(req.session.user.id, req.body.projectId)

  if (user instanceof Error) {
    const js = JSON.parse(user.message)
    res.status(js.status)
    res.json(js.message)
    return
  }

  res.status(200)
}


