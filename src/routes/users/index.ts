import { Router } from 'express'
import { auth, avatar } from '../../middlewares'
import { signupUser } from './signup'
import { updateUser } from './update'
import { loginUser } from './login'
import { logoutUser } from './logout'
import { deleteUser } from './delete'
import { getProfile } from './get'
import {
  getAvatar,
  uploadAvatar,
  deleteAvatar,
  uploadAvatarErrorHandler
} from './avatar'

const userRouter = Router()

userRouter.route('/users/me')
  .get(auth, getProfile)
  .patch(auth, updateUser)
  .delete(auth, deleteUser)

userRouter.route('/users')
  .post(signupUser)

userRouter.route('/users/login')
  .post(loginUser)

userRouter.route('/users/logout')
  .post(auth, logoutUser)

userRouter.route('/users/me/avatar')
  .post(auth, avatar.single('avatar'), uploadAvatar, uploadAvatarErrorHandler)
  .get(auth, getAvatar)
  .delete(auth, deleteAvatar)

export default userRouter
