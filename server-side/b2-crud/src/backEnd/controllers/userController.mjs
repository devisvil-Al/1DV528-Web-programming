// the controller for user

// src/controllers/userController.mjs

import { UserModel as model } from '../models/user.mjs'

export const UserController = {}

// check the login credentials
UserController.login = async (req, res, next) => {
  const user = await model.login(req.body)

  if (user instanceof Error) {
    req.session.flashMessage = user.message
    next()
    return
  }

  const sessionUser = {
    id: user.id,
    name: user.firstName + ' ' + user.lastName,
    username: user.username,
    email: user.email,
    ratedSnippets: user.ratedSnippets
  }

  req.session.user = sessionUser
  req.session.flashMessage = 'Successfully logged in'
  next()
}

// register a new user
UserController.register = async (req, res, next) => {
  const user = await model.register(req.body)

  if (user instanceof Error) {
    const errorData = JSON.parse(user.message)
    req.session.flashMessage = errorData.message
    res.status(errorData.status).redirect('/register')
    return
  }

  req.session.flashMessage = 'Successfully registered, You can now login'
  next()
}

UserController.addSnippet = async (userId, snippetId) => {
  const adding = await model.addSnippet(userId, snippetId)
  if (adding instanceof Error) {
    return new Error(JSON.stringify({ status: 500, message: 'Internal Server Error' }))
  }
}

UserController.removeSnippet = async (userId, snippetId) => {
  const remove = await model.removeSnippet(userId, snippetId)
  if (remove instanceof Error) {
    return remove
  }
}

UserController.getUser = async (id) => {
  try {
    const user = await model.getUser(id)
    return user
  } catch (err) {
    return new Error(JSON.stringify({ status: 500, message: 'Internal Server Error' }))
  }
}

UserController.getAuthorName = async (id) => {
  return await model.getAuthorName(id)
}

UserController.rateSnippet = async (userId, snippetId, rating) => {
  const rated = await model.rateSnippet(userId, snippetId, rating)
  if (rated instanceof Error) {
    return rated
  }
}

UserController.deleteSnippetRatingsFromUsers = async (snippetId) => {
  const deleted = await model.deleteSnippetRatingsFromUsers(snippetId)
  if (deleted instanceof Error) {
    return deleted
  }
}
