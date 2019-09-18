import { Response } from 'express'
import { EnhancedRequest } from '../../middlewares'

export const updateUser = async (req: EnhancedRequest, res: Response): Promise<Response | void> => {
  const { user } = req
  const bodyFields = Object.keys(req.body)
  const validFields = ['name', 'email', 'password', 'age']
  const isValidOperation = bodyFields.every(field => validFields.includes(field))

  if (!isValidOperation) {
    return res
      .status(400)
      .send({
        error: 'Invalid operation. The only valid fields for this route are ' + validFields.join(', ')
      })
  }

  try {
    bodyFields.forEach(field => { user[field] = req.body[field] })
    await user.save()
    res.status(200).send({ user })
  } catch (error) {
    res.status(404).send({ error })
  }
}
