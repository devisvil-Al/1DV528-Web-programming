import { validate as uuidValidator } from 'uuid'

export const validator = {}

// validates the registration form
validator.register = (req, res, next) => {
  const info = req.body
  const { firstName, lastName, username, email, password } = req.body

  if (!firstName) return res.status(400).render('register', { user: null, flashMessage: 'Plesae enter your first name', info })
  if (!lastName) return res.status(400).render('register', { user: null, flashMessage: 'Plesae enter your last name', info })
  if (!username) return res.status(400).render('register', { user: null, flashMessage: 'Plesae enter your username', info })
  if (!email) return res.status(400).render('register', { user: null, flashMessage: 'Plesae enter your email', info })
  if (!email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) return res.status(400).render('register', { user: null, flashMessage: 'Please enter a valid email address', info })
  if (!password) return res.status(400).render('register', { user: null, flashMessage: 'Plesae enter your password', info })
  if (password.length < 8) return res.status(400).render('register', { user: null, flashMessage: 'Password must be at least 8 characters long', info })
  if (!password.match(/[A-Z]/)) return res.status(400).render('register', { user: null, flashMessage: 'Password must contain at least one uppercase letter', info })
  if (!password.match(/[a-z]/)) return res.status(400).render('register', { user: null, flashMessage: 'Password must contain at least one lowercase letter', info })
  if (!password.match(/[0-9]/)) return res.status(400).render('register', { user: null, flashMessage: 'Password must contain at least one number', info })
  next()
}

// validates the login form
validator.login = (req, res, next) => {
  // validate that all nedded fields are present
  const { username, password } = req.body
  if (!username) return res.status(400).render('login', { flashMessage: 'Plesae enter your email' }, req.body)
  if (!password) return res.status(400).render('login', { flashMessage: 'Plesae enter your password' }, req.body)
  next()
}

// validates the snippet form
validator.createSnippet = (req, res, next) => {
  // validate that all nedded fields are present
  const user = req.session.user ?? null
  const { title, snippet, language, description } = req.body
  if (!user) return res.status(403).render('login', { flashMessage: 'Please login to be able to create snippets', user, snippets: [req.body] })
  if (!uuidValidator(user.id)) return res.status(401).render('login', { flashMessage: 'Something is wrong with your credintials', user, snippets: [req.body] })
  if (!title) return res.status(400).render('createSnippet', { flashMessage: 'Please enter a title', user, snippets: [req.body] })
  if (!snippet) return res.status(400).render('createSnippet', { flashMessage: 'Please enter a snippet', user, snippets: [req.body] })
  if (!language) return res.status(400).render('createSnippet', { flashMessage: 'Please enter a language', user, snippets: [req.body] })
  if (!description) return res.status(400).render('createSnippet', { flashMessage: 'Please enter a description', user, snippets: [req.body] })
  if (!req.body.private) req.body.isPublic = true
  if (req.body.private) req.body.isPublic = false
  next()
}

// checks if the user is logged in
validator.isLoggedIn = (req, res, next) => {
  const user = req.session.user ?? null
  if (!user) return res.status(403).render('login', { flashMessage: 'Please login to continue', user })
  next()
}

// checks if the user is logged in if he requests the register page
validator.isOkToRegister = async (req, res, next) => {
  // check if user is already logged in
  if (req.session.user) return res.status(400).render('home', { flashMessage: 'You are already logged in', user: req.session.user })
  next()
}

// validate the id of a snippet
validator.validateId = async (req, res, next) => {
  const id = req.params.id
  if (!uuidValidator(id)) {
    req.session.flashMessage = 'Invalid id'
    return res.status(400).redirect('/snippet')
  }
  next()
}

// checks if the user is the owner of the snippet
validator.validateUserSnippet = async (req, res, next) => {
  const user = req.session.user
  const snippet = req.session.snippets
  if (user.id !== snippet[0].createdBy) {
    req.session.flashMessage = 'You are not allowed to edit this snippet'
    return res.status(401).redirect('/snippet')
  }
  next()
}

// checks if the snippet is public
validator.validateIsPublic = async (req, res, next) => {
  const snippet = req.session.snippets
  if (!snippet[0].isPublic) {
    if (!req.session.user || req.session.user.id !== snippet[0].createdBy) {
      req.session.flashMessage = 'Invaild Snippet Id'
      return res.status(404).redirect('/snippet')
    }
  }

  next()
}

// checks if the rating is valid
validator.validateRating = async (req, res, next) => {
  const rating = req.body.rating
  if (rating < 1 || rating > 5) {
    req.session.flashMessage = 'Invaild rating'
    return res.status(400).redirect('/snippet')
  }
  next()
}
