import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import User from '../../src/models/user'

export const testId = new mongoose.Types.ObjectId()
export const testUser = {
  _id: testId,
  name: 'Lucas',
  email: 'lol123@example.com',
  password: 'IunnaIsFive',
  tokens: [{
    token: jwt.sign({ _id: testId }, process.env.JWT_SECRET)
  }]
}

export const setupDB = async (): Promise<void> => {
  await User.deleteMany(null)
  await new User(testUser).save()
}
