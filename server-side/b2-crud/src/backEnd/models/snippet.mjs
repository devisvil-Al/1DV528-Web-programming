import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
import { UserModel } from './user.mjs'

export const SnippetModel = {}

const snippetSchema = new mongoose.Schema({

  id: { type: String, required: true, unique: true, primary: true },

  title: { type: String, required: true, uppercase: true },

  snippet: { type: String, required: true },

  language: { type: String, required: true },

  description: { type: String, default: 'No description was provided for this snippet' },

  createdBy: { type: String, required: true },

  isPublic: { type: Boolean, default: false },

  rates: [{ type: Number, default: 0 }],

  rating: { type: Number, default: 0 }

}, { timestamps: true })

const Snippet = mongoose.model('Snippet', snippetSchema)

// done
// function find all snippets and return them to the controller
SnippetModel.findAll = async (user) => {
  let snippets = []
  let privateSnippets = []
  let publicSnippets = []
  try {
    // when no id is provided, return all public snippets
    publicSnippets = await Snippet.find({ isPublic: true })

    if (user) {
      // when an id is provided, return all public snippets and all private snippets created by the user
      privateSnippets = await Snippet.find({ isPublic: false, createdBy: user.id })
      for (let i = 0; i < privateSnippets.length; i++) {
        privateSnippets[i].creator = 'You'
      }
    }

    for (let i = 0; i < publicSnippets.length; i++) {
      if (user) {
        if (publicSnippets[i].createdBy === user.id) {
          publicSnippets[i].creator = 'You'
          continue
        }
      }
      publicSnippets[i].creator = await UserModel.getAuthorName(publicSnippets[i].createdBy)
    }

    snippets = publicSnippets.concat(privateSnippets)
    return snippets
  } catch (err) {
    const errorData = { status: 500, message: 'Internal Server Error' }
    return new Error(JSON.stringify(errorData))
  }
}

SnippetModel.findOne = async (id) => {
  try {
    const snippet = await Snippet.findOne({ id })

    if (!snippet) {
      const errorData = { status: 404, message: 'No Snippet found with this id: ' + id }
      return new Error(JSON.stringify(errorData))
    }
    return snippet
  } catch (err) {
    const errorData = { status: 500, message: 'Internal Server Error' }
    return new Error(JSON.stringify(errorData))
  }
}

// done
// create a snippet and return it to the controller
SnippetModel.create = async (snippet) => {
  // generate a unique id for the snippet with a maximum of 10 attempts else return an error
  let attempts = 10
  while (true) {
    snippet.id = uuidv4()
    const matches = await Snippet.findOne({ id: snippet.id })
    if (!matches) {
      break
    }
    if (attempts === 0) {
      const errorData = { status: 500, message: 'Internal server error' }
      return new Error(JSON.stringify(errorData))
    }
    attempts--
  }

  try {
    const newSnippet = new Snippet(snippet)
    await newSnippet.save()
    return await SnippetModel.findOne(newSnippet.id)
  } catch (error) {
    const errorData = { status: 500, message: 'Internal server error' }
    return new Error(JSON.stringify(errorData))
  }
}

SnippetModel.delete = async (id) => {
  try {
    const deleted = Snippet.deleteOne({ id })
    if (!deleted) {
      const errorData = { status: 404, message: 'No Snippet found with this id: ' + id }
      return new Error(JSON.stringify(errorData))
    }
    return deleted
  } catch (err) {
    const errorData = { status: 500, message: 'Internal Server Error' }
    return new Error(JSON.stringify(errorData))
  }
}

// done
// edit a snippet and return it to the controller
SnippetModel.edit = async (id, snippet) => {
  try {
    const updated = await Snippet.updateOne({ id }, snippet)
    if (!updated) {
      const errorData = { status: 404, message: 'No Snippet found with this id: ' + id }
      return new Error(JSON.stringify(errorData))
    }
    return await SnippetModel.findOne(id)
  } catch (err) {
    if (err) {
      const errorData = { status: 500, message: 'Internal server error' }
      return new Error(JSON.stringify(errorData))
    }
  }
}

SnippetModel.rate = async (id, rating) => {
  let newRating = []
  try {
    const snippet = await SnippetModel.findOne(id)
    if (snippet instanceof Error) {
      return snippet
    }

    snippet.rates.push(parseInt(rating))

    // calculate the average rating
    const sum = snippet.rates.reduce((a, b) => a + b, 0)
    newRating = sum / snippet.rates.length
    newRating = newRating.toFixed(1)

    const updated = await Snippet.updateOne({ id }, { rating: newRating, rates: snippet.rates })
    if (!updated) {
      const errorData = { status: 404, message: 'No Snippet found with this id: ' + id }
      return new Error(JSON.stringify(errorData))
    }
    // return await SnippetModel.findOne(id)
    return newRating
  } catch (err) {
    const errorData = { status: 500, message: 'Internal server error' }
    return new Error(JSON.stringify(errorData))
  }
}
