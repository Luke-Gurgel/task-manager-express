import { Router } from 'express'
import { createTask } from './create'
import { updateTask } from './update'
import { deleteTask } from './delete'
import { getTasks } from './get'
import { auth } from '../../middlewares/auth'

const taskRouter = Router()

taskRouter.route('/tasks')
  .get(auth, getTasks)
  .post(auth, createTask)

taskRouter.route('/tasks/:id')
  .patch(auth, updateTask)
  .delete(auth, deleteTask)

export default taskRouter
