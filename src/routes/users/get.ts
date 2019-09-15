import { Response } from 'express'
import { EnhancedRequest } from '../../middlewares'

export const getProfile = (req: EnhancedRequest, res: Response): void => {
  res.send({ user: req.user })
}
