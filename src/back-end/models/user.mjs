import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'

const UserModel = {}
export default UserModel

const userSchema = new mongoose.Schema({

  id: { type: String, required: true, unique: true },

  firstName: { type: String, required: true, toUpperCase: true },

  lastName: { type: String, required: true, toUpperCase: true },

  email: { type: String, required: true },

  password: { type: String, required: true },
  
  provider: { type: String, required: true }, // 'google', 'gitlab', or 'local'

  providerId: { type: String, unique: true, sparse: true }, // ID from the authentication provider

  SubscribeTo: [{ type: String }],

}, { timestamps: true })

const User = mongoose.model('User', userSchema)

// register new user
UserModel.register = async (user) => {
  try {
    // Check if the user already exists
    let existingUser

    if (user.provider === 'local') {
      existingUser = await User.findOne({ email: user.email, provider: user.provider })
    } else {
      existingUser = await User.findOne({ providerId: user.providerId, provider: user.provider })
    }

    if (existingUser) {
      const errData = { status: 409, message: 'User already exsist' }
      return new Error(JSON.stringify(errData))
    }

    if (user.provider !== 'local') {
      // password create for OAuth
      user.password = user.providerId + user.firstName
    }

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)
    

    let attempts = 10
    while (true) {
      user.id = uuidv4()
      existingUser = await User.findOne({ id: user.id })
      if (!existingUser) {
        break
      }
      if (attempts === 0) {
        const errData = { status: 500, message: 'Internal Server Error' }
        return new Error(JSON.stringify(errData))
      }
      attempts--
    }

    // Create a new user
    const newUser = new User(user)
    await newUser.save()
    return newUser

  } catch (err) {
    console.log('Error registering user', err)
    const errData = { status: 500, message: 'Internal Server Error' }
    return new Error(JSON.stringify(errData))
  }
}

UserModel.login = async (user) => {

  try {
    // check if the user exists
    let existingUser

    if (user.provider === 'local') {
      existingUser = await User.findOne({ email: user.email, provider: user.provider })
    } else {
      existingUser = await User.findOne({ providerId: user.providerId, provider: user.provider })
    }

    console.log(user)
    console.log(existingUser)

    if (existingUser === null) {
      const errData = { status: 404, message: 'User not found' } 
      return new Error(JSON.stringify(errData))
    }

    if (user.provider !== 'local') {
      // password create for OAuth
      user.password = user.providerId + user.firstName
    }

    if (! await bcrypt.compare(user.password, existingUser.password)) {
      const errData = { status: 401, message: 'Invalid credentials' }
      return new Error(JSON.stringify(errData))
    }

    return existingUser
  
  } catch (err) {
    const errData = { status: 500, message: 'Internal Server Error' }
    return new Error(JSON.stringify(errData))
  }

}


UserModel.getSubscribedProjects = async (id) => {

  try {
    let existingUser = await User.findOne({ id: id })

    if (existingUser === null) {
      const errData = { status: 404, message: 'User not found' }
      return new Error(JSON.stringify(errData))
    }
    
    return existingUser.SubscribeTo

  } catch (err) {
    const errData = { status: 500, message: 'Internal Server Error' }
    return new Error(JSON.stringify(errData))
  }
}


UserModel.subscribeToProject = async (id, projectId) => {

  try {

    let existingUser = await User.findOne({ id: id })

    if (existingUser === null) {
      const errData = { status: 404, message: 'User not found' }
      return new Error(JSON.stringify(errData))
    }

    if (existingUser.SubscribeTo.includes(projectId)) {
      const errData = { status: 409, message: 'User already subscribed to project' }
      return new Error(JSON.stringify(errData))
    }

    existingUser.SubscribeTo.push(projectId)
    await existingUser.save()

    return existingUser


  }
  catch (err) {
    const errData = { status: 500, message: 'Internal Server Error' }
    return new Error(JSON.stringify(errData))
  }

}


UserModel.unsubscribeFromProject = async (id, projectId) => {

  try {
    let existingUser = await User.findOne({ id: id })

    if (existingUser === null) {
      const errData = { status: 404, message: 'User not found' }
      return new Error(JSON.stringify(errData))
    }

    if (!existingUser.SubscribeTo.includes(projectId)) {
      const errData = { status: 409, message: 'User not subscribed to project' }
      return new Error(JSON.stringify(errData))
    }

    existingUser.SubscribeTo = existingUser.SubscribeTo.filter((item) => item !== projectId)
    await existingUser.save()

    return existingUser

  } catch (err) {
    const errData = { status: 500, message: 'Internal Server Error' }
    return new Error(JSON.stringify(errData))
  }

}

