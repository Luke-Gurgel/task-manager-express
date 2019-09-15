import { Response } from 'express'
import { EnhancedRequest } from '../../middlewares'
import { sendGoodbyeEmail } from '../../emails/account'

export const deleteUser = async (req: EnhancedRequest, res: Response): Promise<void> => {
  try {
    await req.user.remove()
    sendGoodbyeEmail(req.user.email, req.user.name)
    res.status(200).send()
  } catch (error) {
    res.status(500).send({ error })
  }
}
