import { giftService } from '../services/giftService.js';

export const paymentController = {
  async createPreference(req, res, next) {
    try {
      const checkout = await giftService.createCheckout(req.validated.body);
      return res.status(201).json(checkout);
    } catch (error) {
      return next(error);
    }
  },
};
