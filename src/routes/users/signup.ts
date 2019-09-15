import { Request, Response } from 'express'
import User from '../../models/user'
import { sendWelcomeEmail } from '../../emails/account'

export const signupUser = async (req: Request, res: Response): Promise<void> => {
  const user = new User(req.body)
  try {
    await user.save()
    sendWelcomeEmail(user.email, user.name)
    const token = await user.generateJwt()
    res.status(201).send({ user, token })
  } catch (error) {
    res.status(400).send({ error })
  }
}
