import { Request, Response, NextFunction } from 'express'
import User from '../models/user'
import { UserDoc } from '../models/user/types'
import jwt from 'jsonwebtoken'

export interface EnhancedRequest extends Request {
  user?: UserDoc;
  token?: string;
}

export const auth = async (req: EnhancedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '')
    const { _id }: any = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findOne({ _id, 'tokens.token': token })

    if (!user) throw Error()

    req.user = user
    req.token = token
    next()
  } catch (e) {
    res.status(401).send({ error: 'Not authenticated.' })
  }
}
