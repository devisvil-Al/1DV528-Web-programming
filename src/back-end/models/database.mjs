import mongoose from 'mongoose'
import * as dotenv from 'dotenv'


const database = {}
export default database
dotenv.config()
console.log(process.env.MONGO_URI)
mongoose.Promise = global.Promise

database.connectDatabase = async () => {
  try {
    await mongoose.connect('mongodb+srv://admin:Evilgood666@cluster0.lsxsfds.mongodb.net/CRUD', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 3000
    })
    console.log('Connected to MongoDB')
    console.log('Mongoose version', mongoose.version)
    console.log('Mongoose connection state', mongoose.connection.readyState)
    console.log('Mongoose connection host', mongoose.connection.host)
    console.log('Mongoose connection port', mongoose.connection.port)
    console.log('Mongoose connection name', mongoose.connection.name)
  } catch (err) {
    console.log('Error connecting to MongoDB', err)
  }
}

database.disconnectDatabase = async () => {
  try {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  } catch (err) {
    console.log('Error disconnecting from MongoDB', err)
  }
}

database.getDatabase = () => {
  return mongoose.connection
}