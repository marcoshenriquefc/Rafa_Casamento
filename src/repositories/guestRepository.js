import { GuestModel } from '../models/Guest.js';

export const guestRepository = {
  create: (data) => GuestModel.create(data),
  findByEmail: (email) => GuestModel.findOne({ email: email.toLowerCase().trim() }),
  findByInvitationCode: (invitationCode) => GuestModel.findOne({ invitationCode }),
  list: () => GuestModel.find().sort({ createdAt: -1 }),
  save: (guest) => guest.save(),
  deleteByInvitationCode: (invitationCode) => GuestModel.findOneAndDelete({ invitationCode }),
};
