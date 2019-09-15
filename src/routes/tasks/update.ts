import { Response } from 'express'
import { EnhancedRequest } from '../../middlewares/auth'
import Tasks from '../../models/task'

export const updateTask = async (req: EnhancedRequest, res: Response): Promise<Response | void> => {
  const { params: { id } } = req
  const fieldsToUpdate = Object.keys(req.body)
  const validFields = ['description', 'completed']
  const isValidOp = fieldsToUpdate.every(field => validFields.includes(field))

  if (!isValidOp) {
    return res
      .status(400)
      .send({ error: 'Invalid update. Valid fields are: ' + validFields.join(', ').trim() })
  }

  try {
    const task = await Tasks.findOne({ _id: id, owner: req.user._id })

    if (!task) {
      return res.status(404).send({ error: 'Task not found' })
    }

    fieldsToUpdate.forEach(field => { task[field] = req.body[field] })
    await task.save()

    res.status(200).send({ success: true })
  } catch (error) {
    res.status(500).send({ error })
  }
}
