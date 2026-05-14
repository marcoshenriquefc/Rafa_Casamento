import { giftService } from '../services/giftService.js';
import { cloudinary } from '../config/cloudinary.js'
import { GiftModel } from '../models/Gift.js'
import streamifier from 'streamifier'

export const giftController = {
  async create(req, res, next) {
    // try {
    //   const gift = await giftService.createGift({
    //     ...req.validated.body,
    //     imageUrl: req.file?.path || '',
    //     createdBy: req.user.sub,
    //   });
    //   return res.status(201).json(gift);
    // } catch (error) {
    //   return next(error);
    // }

    try {
      let imageUrl = null

      // upload imagem
      if (req.file) {
        const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: 'rafa-casamento/gifts',
              resource_type: 'image'
            },
            (error, result) => {
              if (error) {
                return reject(error)
              }

              resolve(result)
            }
          )

          streamifier
            .createReadStream(req.file.buffer)
            .pipe(stream)
        })

        imageUrl = uploadResult.secure_url
      }

      // cria presente
      const gift = await GiftModel.create({
        title: req.body.title,
        description: req.body.description,
        price: Number(req.body.price),
        quantity: Number(req.body.quantity),
        createdBy: req.user.sub,
        imageUrl,
      })

      return res.status(201).json(gift)
    }
    catch (err) {
      console.error(err)

      return res.status(500).json({
        message: 'Erro ao criar presente'
      })
    }
  },

  async listAvailable(_req, res, next) {
    try {
      const gifts = await giftService.listAvailableGifts();
      return res.status(200).json(gifts);
    } catch (error) {
      return next(error);
    }
  },

  async createCheckout(req, res, next) {
    try {
      const checkout = await giftService.createCheckout(req.validated.body);
      return res.status(201).json(checkout);
    } catch (error) {
      return next(error);
    }
  },

  async paymentWebhook(req, res, next) {
    try {
      const paymentId = req.body?.data?.id || req.query['data.id'] || req.query.id;
      await giftService.processMercadoPagoWebhook({ paymentId });
      return res.status(200).json({ received: true });
    } catch (error) {
      return next(error);
    }
  },

  async listOrdersByInvitation(req, res, next) {
    try {
      const orders = await giftService.listOrdersByInvitation(req.params.invitationCode);
      return res.status(200).json(orders);
    } catch (error) {
      return next(error);
    }
  },
};
