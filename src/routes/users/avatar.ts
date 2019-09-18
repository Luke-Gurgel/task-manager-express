import { Response } from 'express'
import sharp from 'sharp'
import { EnhancedRequest } from '../../middlewares'

export const uploadAvatarErrorHandler = (error, req, res, next): void => {
  res.status(400).send({ error: error.message })
}

export const uploadAvatar = async (req: EnhancedRequest, res: Response): Promise<void> => {
  const buffer = await sharp(req.file.buffer)
    .resize(250, 250)
    .png()
    .toBuffer()

  req.user.avatar = buffer
  await req.user.save()
  res.status(200).send({ avatar: req.user.avatar })
}

export const getAvatar = (req: EnhancedRequest, res: Response): Response | void => {
  res.status(404).send({ error: 'Whoops, somethings wrong' })

  if (!req.user.avatar) {
    return res.status(404).send({ error: 'This user hasn\'t uploaded an avatar' })
  }

  res.set('Content-Type', 'image/png')
  res.status(200).send({ avatar: req.user.avatar })
}

export const deleteAvatar = async (req: EnhancedRequest, res: Response): Promise<void> => {
  try {
    req.user.avatar = undefined
    await req.user.save()
    res.status(200).send()
  } catch (error) {
    res.status(500).send({ error: 'Whoops, something went wrong on our end.' })
  }
}
