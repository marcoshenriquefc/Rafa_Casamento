import { GiftModel } from '../models/Gift.js';

export const giftRepository = {
  create: (data) => GiftModel.create(data),
  listActive: () => GiftModel.find({ active: true }).sort({ createdAt: -1 }),
  findById: (id) => GiftModel.findById(id),
  save: (gift) => gift.save(),
};
