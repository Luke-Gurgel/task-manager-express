import { Response } from 'express'
import { EnhancedRequest } from '../../middlewares'

export const logoutUser = async (req: EnhancedRequest, res: Response): Promise<Response | void> => {
  const { user, token, body: { allDevices } } = req

  try {
    allDevices ? user.tokens = [] : user.tokens = user.tokens.filter(tok => tok.token !== token)
    await user.save()
    res.status(200).send({ message: 'Successfully logged out' })
  } catch (error) {
    res.status(500).send({ error })
  }
}
