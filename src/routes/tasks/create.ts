import { Response } from 'express'
import { EnhancedRequest } from '../../middlewares/auth'
import Tasks from '../../models/task'

export const createTask = (req: EnhancedRequest, res: Response): void | Response => {
  if (!req.body.description) {
    return res.status(400).send({ error: 'Task description must be provided' })
  }

  const task = new Tasks({ ...req.body, owner: req.user.id })
  task.save()
    .then(task => res.status(201).send({ task }))
    .catch(error => res.status(500).send({ error }))
}
