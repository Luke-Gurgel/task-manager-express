import { Response } from 'express'
import { EnhancedRequest } from '../../middlewares/auth'

interface TaskQuery {
  _id?: string;
  completed?: boolean;
  description?: string;
}

export const getTasks = async (req: EnhancedRequest, res: Response): Promise<void> => {
  const match: TaskQuery = {}
  const sort = {}

  if (req.query.completed) {
    match.completed = req.query.completed === 'true'
  }

  if (req.query.description) {
    match.description = req.query.description
  }

  if (req.query.id) {
    match._id = req.query.id
  }

  if (req.query.sortBy) {
    const [attr, order] = req.query.sortBy.split(':')
    sort[attr] = order === 'asc' ? 1 : -1
  }

  try {
    await req.user.populate({
      match,
      path: 'tasks',
      options: {
        sort,
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip)
      }
    }).execPopulate()
    res.status(200).send({ tasks: req.user.tasks })
  } catch (error) {
    res.status(500).send({ error })
  }
}
