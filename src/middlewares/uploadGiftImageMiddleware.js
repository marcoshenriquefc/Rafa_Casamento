import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { cloudinary } from '../config/cloudinary.js';
import { HttpError } from '../utils/httpError.js';

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'rafa-casamento/gifts',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadGiftImage = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (!err) return next();
    return next(new HttpError(400, err.message || 'Erro ao fazer upload da imagem.'));
  });
};
