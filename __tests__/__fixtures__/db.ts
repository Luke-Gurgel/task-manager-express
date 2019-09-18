import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import User from '../../src/models/user'
import Task from '../../src/models/task'

export const userOneId = new mongoose.Types.ObjectId()
export const userOne = {
  _id: userOneId,
  name: 'Lucas',
  email: 'lol123@example.com',
  password: 'IunnaIsFive',
  tokens: [{
    token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
  }]
}

export const userTwoId = new mongoose.Types.ObjectId()
export const userTwo = {
  _id: userTwoId,
  name: 'Lucas',
  email: 'blah@example.com',
  password: 'MimoIsFive',
  tokens: [{
    token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
  }]
}

export const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  description: '1st task',
  completed: false,
  owner: userOne._id
}

export const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  description: '2nd task',
  completed: true,
  owner: userOne._id
}

export const taskThree = {
  _id: new mongoose.Types.ObjectId(),
  description: '3rd task',
  completed: true,
  owner: userTwo._id
}

export const setupDB = async (): Promise<void> => {
  await User.deleteMany(null)
  await Task.deleteMany(null)
  await new User(userOne).save()
  await new User(userTwo).save()
  await new Task(taskOne).save()
  await new Task(taskTwo).save()
  await new Task(taskThree).save()
}
