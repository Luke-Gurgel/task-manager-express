import req from 'supertest'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import app from '../src/app'
import User from '../src/models/user'

const testId = new mongoose.Types.ObjectId()
const testUser = {
  _id: testId,
  name: 'Lucas',
  email: 'lol123@example.com',
  password: 'IunnaIsFive',
  tokens: [{
    token: jwt.sign({ _id: testId }, process.env.JWT_SECRET)
  }]
}

beforeEach(async () => {
  await User.deleteMany(null)
  await new User(testUser).save()
})

test('should sign up a new user', async () => {
  const name = 'Thais'
  const email = 'blah123@example.com'
  const password = 'IunnaIsFive'

  const res = await req(app)
    .post('/users')
    .send({ name, email, password })
    .expect(201)

  const createdUser = await User.findById(res.body.user._id)

  expect(createdUser).not.toBeNull()
  expect(createdUser.password).not.toBe(password)
  expect(res.body).toMatchObject({
    user: { name, email },
    token: createdUser.tokens[0].token
  })
})

test('should not sign up a new user if email is invalid', async () => {
  await req(app)
    .post('/users')
    .send({ name: 'Thais', email: 'invalidemail.com', password: 'IunnaIsFive' })
    .expect(400)
})

test('should not sign up a new user if name is not provided', async () => {
  await req(app)
    .post('/users')
    .send({ email: 'test@example.com', password: 'IunnaIsFive' })
    .expect(400)
})

test('should not sign up a new user if password is too short', async () => {
  await req(app)
    .post('/users')
    .send({ name: 'Thais', email: 'test@example.com', password: 'Mimo' })
    .expect(400)
})

test('should not sign up a new user if password contains the word password', async () => {
  await req(app)
    .post('/users')
    .send({ name: 'Thais', email: 'test@example.com', password: 'Mimopassword' })
    .expect(400)
})

test('should log in an existing user', async () => {
  const res = await req(app)
    .post('/users/login')
    .send({ email: testUser.email, password: testUser.password })
    .expect(200)

  const loggedUser = await User.findById(res.body.user._id)
  expect(loggedUser.tokens[1].token).toBe(res.body.token)
})

test('should not log in a nonexistent user', async () => {
  await req(app)
    .post('/users/login')
    .send({ email: 'idontexist@example.com', password: 'badpass' })
    .expect(400)
})

test('should get profile for user', async () => {
  await req(app)
    .get('/users/me')
    .set('Authorization', 'Bearer ' + testUser.tokens[0].token)
    .send()
    .expect(200)
})

test('should not return profile for unauthorized user', async () => {
  await req(app)
    .get('/users/me')
    .send()
    .expect(401)
})

test("should delete user's account if authorized", async () => {
  await req(app)
    .delete('/users/me')
    .set('Authorization', 'Bearer ' + testUser.tokens[0].token)
    .send()
    .expect(200)

  const deletedUser = await User.findById(testId)
  expect(deletedUser).toBeNull()
})

test("should not delete user's account if unauthorized", async () => {
  await req(app)
    .delete('/users/me')
    .send()
    .expect(401)
})
