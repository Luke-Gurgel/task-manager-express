import req from 'supertest'
import app from '../src/app'
import Task from '../src/models/task'
import {
  setupDB,
  userOne,
  userOneId,
  userTwo,
  taskOne,
  taskTwo,
  taskThree
} from './__fixtures__/db'

const authHeader = 'Authorization'

beforeEach(setupDB)

test('should create a task for user with completed property set to false by default', async () => {
  const description = 'from this beautiful test'
  const res = await req(app)
    .post('/tasks')
    .set(authHeader, 'Bearer ' + userOne.tokens[0].token)
    .send({ description })
    .expect(201)

  const newTask = await Task.findById(res.body.task._id)

  expect(newTask).not.toBeNull()
  expect(newTask.owner).toEqual(userOneId)
  expect(newTask.description).toEqual(description)
  expect(newTask.completed).toBe(false)
})

test('should not create task if not authenticated', async () => {
  await req(app)
    .post('/tasks')
    .send({ description: '' })
    .expect(401)
})

test('should not create task if description is not provided', async () => {
  await req(app)
    .post('/tasks')
    .set(authHeader, 'Bearer ' + userOne.tokens[0].token)
    .send({ completed: false })
    .expect(400)
})

test("should delete user's task", async () => {
  await req(app)
    .delete('/tasks/' + taskThree._id)
    .set(authHeader, userTwo.tokens[0].token)
    .send()
    .expect(200)

  const task = await Task.findById(taskThree._id)
  expect(task).toBeNull()
})

test('should not delete task if not authenticated', async () => {
  await req(app)
    .delete('/tasks/' + taskThree._id)
    .send()
    .expect(401)

  const task = await Task.findById(taskThree._id)
  expect(task).not.toBeNull()
})

test("user should not be able to delete another user's task", async () => {
  await req(app)
    .delete('/tasks/' + taskThree._id)
    .set(authHeader, userOne.tokens[0].token)
    .send()
    .expect(404)

  const task = await Task.findById(taskThree._id)
  expect(task).not.toBeNull()
})

test('should update task', async () => {
  const updatedTask = { description: 'blah blah blah', completed: false }
  await req(app)
    .patch('/tasks/' + taskThree._id)
    .set(authHeader, userTwo.tokens[0].token)
    .send(updatedTask)
    .expect(200)

  const task = await Task.findById(taskThree._id)
  expect(task).not.toBeNull()
  expect(task.description).toEqual(updatedTask.description)
  expect(task.completed).toEqual(updatedTask.completed)
})

test('should not update task if not authenticated', async () => {
  await req(app)
    .patch('/tasks/' + taskThree._id)
    .send({ description: 'blah blah blah' })
    .expect(401)
})

test('should not update task with invalid fields', async () => {
  await req(app)
    .patch('/tasks/' + taskThree._id)
    .set(authHeader, userTwo.tokens[0].token)
    .send({ 123: 'TragoYTeOlvido' })
    .expect(400)

  const task = await Task.findById(taskThree._id)
  expect(task).not.toBeNull()
  expect(task.description).toEqual(taskThree.description)
})

test('should not update task with invalid description', async () => {
  await req(app)
    .patch('/tasks/' + taskThree._id)
    .set(authHeader, userTwo.tokens[0].token)
    .send({ description: '' })
    .expect(500)

  const task = await Task.findById(taskThree._id)
  expect(task).not.toBeNull()
  expect(task.description).toEqual(taskThree.description)
})

test('should fetch tasks for a specific user', async () => {
  const res = await req(app)
    .get('/tasks')
    .set(authHeader, 'Bearer ' + userOne.tokens[0].token)
    .send()
    .expect(200)

  expect(res.body.tasks).toBeInstanceOf(Array)
  expect(res.body.tasks.length).toBe(2)
})

test('should not fetch tasks for user if not authenticated', async () => {
  await req(app)
    .get('/tasks')
    .send()
    .expect(401)
})

test('should fetch only completed tasks for a specific user', async () => {
  const res = await req(app)
    .get('/tasks?completed=true')
    .set(authHeader, 'Bearer ' + userOne.tokens[0].token)
    .send()
    .expect(200)

  expect(res.body.tasks).toBeInstanceOf(Array)
  expect(res.body.tasks.length).toBe(1)
})

test('should fetch only incomplete tasks for a specific user', async () => {
  const res = await req(app)
    .get('/tasks?completed=false')
    .set(authHeader, 'Bearer ' + userOne.tokens[0].token)
    .send()
    .expect(200)

  expect(res.body.tasks).toBeInstanceOf(Array)
  expect(res.body.tasks.length).toBe(1)
})

test('should fetch tasks sorted in ascending order by created date (oldest 1st)', async () => {
  const res = await req(app)
    .get('/tasks?sortBy=createdAt:asc')
    .set(authHeader, 'Bearer ' + userOne.tokens[0].token)
    .send()
    .expect(200)

  expect(res.body.tasks).toBeInstanceOf(Array)
  expect(res.body.tasks.length).toBe(2)
  expect(res.body.tasks[0]._id).toEqual(taskOne._id.toString())
})

test('should fetch tasks sorted in descending order by created date (most recent 1st)', async () => {
  const res = await req(app)
    .get('/tasks?sortBy=createdAt:desc')
    .set(authHeader, 'Bearer ' + userOne.tokens[0].token)
    .send()
    .expect(200)

  expect(res.body.tasks).toBeInstanceOf(Array)
  expect(res.body.tasks.length).toBe(2)
  expect(res.body.tasks[0]._id).toEqual(taskTwo._id.toString())
})

test('should fetch tasks with pagination', async () => {
  const res = await req(app)
    .get('/tasks?skip=1')
    .set(authHeader, 'Bearer ' + userOne.tokens[0].token)
    .send()
    .expect(200)

  expect(res.body.tasks).toBeInstanceOf(Array)
  expect(res.body.tasks.length).toBe(1)
})
