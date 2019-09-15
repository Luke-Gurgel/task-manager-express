import { Response } from 'express'
import { EnhancedRequest } from '../../middlewares/auth'
import Tasks from '../../models/task'

export const deleteTask = async (req: EnhancedRequest, res: Response): Promise<Response | void> => {
  const { params: { id } } = req

  try {
    const task = await Tasks.findOne({ _id: id, owner: req.user._id })

    if (!task) {
      return res.status(404).send({ error: 'Task not found' })
    }

    await task.remove()
    res.status(200).send({ success: true })
  } catch (error) {
    res.status(500).send({ error })
  }
}
