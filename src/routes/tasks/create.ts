import { Response } from 'express'
import { EnhancedRequest } from '../../middlewares/auth'
import Tasks from '../../models/task'

export const createTask = (req: EnhancedRequest, res: Response): void => {
  const task = new Tasks({
    ...req.body,
    owner: req.user.id
  })
  task.save()
    .then(task => res.status(201).send({ task }))
    .catch(error => res.status(500).send({ error }))
}
