import { Response } from 'express'
import { EnhancedRequest } from '../../middlewares/auth'
import Tasks from '../../models/task'

export const createTask = (req: EnhancedRequest, res: Response): void => {
  const task = new Tasks({
    ...req.body,
    owner: req.user.id
  })
  task.save()
    .then(result => res.status(201).send({ message: 'Task created successfully', result }))
    .catch(error => res.status(400).send(error))
}
