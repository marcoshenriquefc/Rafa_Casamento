import multer from 'multer'
import { HttpError } from '../utils/httpError.js'

const storage = multer.memoryStorage()

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
})

export const uploadGiftImage = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (!err) {
      return next()
    }

    return next(
      new HttpError(
        400,
        err.message || 'Erro ao fazer upload da imagem.'
      )
    )
  })
}