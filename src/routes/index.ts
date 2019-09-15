import { Router } from 'express'
import users from './users'
import tasks from './tasks'

const rootRouter = Router()

rootRouter.use(users)
rootRouter.use(tasks)

export default rootRouter
