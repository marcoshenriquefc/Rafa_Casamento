import { GiftSelectionModel } from '../models/GiftSelection.js';

export const giftSelectionRepository = {
  create: (data) => GiftSelectionModel.create(data),
  listByGuest: (guestId) => GiftSelectionModel.find({ guest: guestId }).populate('gift'),
};
