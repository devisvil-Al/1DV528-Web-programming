import database from '../models/database.mjs'

const databaseController = {}
export default databaseController

databaseController.connectDatabase = async () => {
  try {
    await database.connectDatabase()
  } catch (err) {
    console.log('Error connecting to MongoDB', err)
  }
}
