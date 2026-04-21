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

  async select(req, res, next) {
    try {
      const selection = await giftService.selectGift(req.validated.body);
      return res.status(201).json(selection);
    } catch (error) {
      return next(error);
    }
  },
};
