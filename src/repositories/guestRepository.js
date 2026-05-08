import { GuestModel } from '../models/Guest.js';

export const guestRepository = {
  create: (data) => GuestModel.create(data),
  findByEmail: (email) => GuestModel.findOne({ email: email.toLowerCase().trim() }),
  findByInvitationCode: (invitationCode) => GuestModel.findOne({ invitationCode }),
  list: () => GuestModel.find().sort({ createdAt: -1 }),
  listByAttendanceStatus: () => GuestModel.find({}, { name: 1, email: 1, invitationCode: 1, attendanceConfirmedAt: 1, companions: 1 }).sort({ name: 1 }),
  save: (guest) => guest.save(),
  deleteByInvitationCode: (invitationCode) => GuestModel.findOneAndDelete({ invitationCode }),
  findById: (id) => GuestModel.findById(id),
};
