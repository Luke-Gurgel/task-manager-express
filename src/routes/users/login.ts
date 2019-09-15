import { Request, Response } from 'express'
import User from '../../models/user'

export const loginUser = async (req: Request, res: Response): Promise<Response | void> => {
  const { email, password } = req.body
  try {
    const user = await User.findByCredentials({ email, password })
    await user.generateJwt()
    res.status(200).send({ user })
  } catch (error) {
    res.status(400).send({ error: error.message })
  }
}
