import { giftService } from '../services/giftService.js';

export const giftController = {
  async create(req, res, next) {
    try {
      const gift = await giftService.createGift({ ...req.validated.body, createdBy: req.user.sub });
      return res.status(201).json(gift);
    } catch (error) {
      return next(error);
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
