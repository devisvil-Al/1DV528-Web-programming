import { SnippetModel as model } from '../models/snippet.mjs'
import { UserController } from './userController.mjs'
export const SnippetController = {}

// done
// function to find all snippets and return them to the router
SnippetController.findAll = async (req, res, next) => {
  let snippets

  if (!req.session.user) {
    snippets = await model.findAll()
  } else {
    const user = await UserController.getUser(req.session.user.id)
    if (user instanceof Error) {
      const errorData = JSON.parse(user.message)
      req.session.flashMessage = errorData.message
      res.status(errorData.status).redirect('/home')
      return
    }
    snippets = await model.findAll(user)
  }

  if (snippets instanceof Error) {
    const errorData = JSON.parse(snippets.message)
    req.session.flashMessage = errorData.message
    res.status(errorData.status).redirect('/home')
    return
  }

  req.session.snippets = snippets
  next()
}

// done
// function to find one snippet and return it to the router
SnippetController.findOne = async (req, res, next) => {
  // find the snippet
  const snippet = await model.findOne(req.params.id)

  if (snippet instanceof Error) {
    const errorData = JSON.parse(snippet.message)
    req.session.flashMessage = errorData.message
    res.status(errorData.status).redirect('/snippet')
    return
  }

  snippet.creator = await UserController.getAuthorName(snippet.createdBy)
  req.session.snippets = [snippet]
  next()
}

// done
// function to create a snippet and return it to the router
SnippetController.create = async (req, res) => {
  // assign the user id to the snippet
  req.body.createdBy = req.session.user.id
  const snippets = await model.create(req.body)

  if (snippets instanceof Error) {
    const errorData = JSON.parse(snippets.message)
    req.session.flashMessage = errorData.message
    res.status(errorData.status).redirect('/snippet')
    return
  }

  // add the snippet to the user
  const snippetadd = await UserController.addSnippet(req.session.user.id, snippets.id)

  if (snippetadd instanceof Error) {
    const errorData = JSON.parse(snippetadd.message)
    req.session.flashMessage = errorData.message
    res.status(errorData.status).redirect('/snippet')
    return
  }

  req.session.snippets = [snippets]
  req.session.flashMessage = 'New Snippet Created'
  res.redirect('/snippet/' + snippets.id)
}

// function to delete a snippet and return it to the router
SnippetController.delete = async (req, res) => {
  // in the route and middleware:
  // 1_check if the user is logged in
  // 2_validate the id of the snippet
  // 3_the check if the snippet exists
  // 4_check if the user is the owner of the snippet
  // 5_ now we can delete the snippet

  const deleted = await model.delete(req.params.id)
  if (deleted instanceof Error) {
    const errorData = JSON.parse(deleted.message)
    res.session.flashMessage = errorData.message
    res.status(errorData.status).redirect('/snippet')
  }

  // remove the snippet from the user
  const user = await UserController.removeSnippet(req.session.user.id, req.params.id)

  if (user instanceof Error) {
    const errorData = JSON.parse(user.message)
    req.session.flashMessage = errorData.message
    res.status(errorData.status).redirect('/snippet')
    return
  }

  req.session.flashMessage = 'Snippet deleted'
  res.status(204).end()

  UserController.deleteSnippetRatingsFromUsers(req.params.id)
}

SnippetController.edit = async (req, res, next) => {
  // in the route and middleware:
  // 1_check if the user is logged in
  // 2_validate the id of the snippet
  // 3_the check if the snippet exists
  // 4_check if the user is the owner of the snippet
  // 5_ now we can delete the snippet

  req.body.id = req.params.id
  const edited = await model.edit(req.params.id, req.body)
  if (edited instanceof Error) {
    const errorData = JSON.parse(edited.message)
    req.session.flashMessage = errorData.message
    res.status(errorData.status)
    res.send('error')
    return
  }

  req.session.flashMessage = 'Snippet updated'
  req.session.snippets = edited

  res.status(200)
  res.send('ok')
}

SnippetController.rate = async (req, res) => {
  const rated = await model.rate(req.params.id, req.body.rating)
  if (rated instanceof Error) {
    const errorData = JSON.parse(rated.message)
    req.session.flashMessage = errorData.message
    res.status(errorData.status).redirect('/snippet')
    return
  }

  const userRate = await UserController.rateSnippet(req.session.user.id, req.params.id, req.body.rating)
  if (userRate instanceof Error) {
    const errorData = JSON.parse(userRate.message)
    req.session.flashMessage = errorData.message
    res.status(errorData.status).redirect('/snippet')
    return
  }
  req.session.user.ratedSnippets.push(req.params.id)
  req.session.flashMessage = 'Snippet rated'
  res.status(200)
  res.send(rated)
}
