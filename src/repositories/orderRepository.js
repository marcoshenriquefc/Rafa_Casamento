import { OrderModel } from '../models/Order.js';

export const orderRepository = {
  create: (payload) => OrderModel.create(payload),
  findByExternalReference: (externalReference) => OrderModel.findOne({ externalReference }),
  findById: (id) => OrderModel.findById(id),
  listByInvitationCode: (invitationCode) => OrderModel.find({ invitationCode }).sort({ createdAt: -1 }).populate('items.gift'),
  save: (order) => order.save(),
};
