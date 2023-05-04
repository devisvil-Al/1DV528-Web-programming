import express from 'express'

import { SnippetController } from '../controllers/snippetController.mjs'
import { validator } from '../middlewares/validator.mjs'
import { sessionHandler } from '../middlewares/sessionHandler.mjs'

const snippetRouter = express.Router()

export default snippetRouter

snippetRouter.get('/', SnippetController.findAll, sessionHandler.snippets)

snippetRouter.get('/create', validator.isLoggedIn, sessionHandler.createSnippet)

snippetRouter.get('/:id', validator.validateId, SnippetController.findOne, validator.validateIsPublic, sessionHandler.snippets)

snippetRouter.post('/create', validator.isLoggedIn, validator.createSnippet, SnippetController.create)

snippetRouter.delete('/:id/delete', validator.isLoggedIn, validator.validateId, SnippetController.findOne, validator.validateIsPublic, validator.validateUserSnippet, SnippetController.delete)

snippetRouter.get('/:id/update', validator.isLoggedIn, validator.validateId, SnippetController.findOne, validator.validateIsPublic, validator.validateUserSnippet, sessionHandler.createSnippet)

snippetRouter.put('/:id/update', validator.isLoggedIn, validator.validateId, validator.createSnippet, SnippetController.edit)

snippetRouter.post('/:id/rate', validator.isLoggedIn, validator.validateId, validator.validateRating, SnippetController.rate)

snippetRouter.get('*', sessionHandler.else)
