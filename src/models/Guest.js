import mongoose from 'mongoose';

const companionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    checkedInAt: { type: Date, default: null },
  },
  { _id: true },
);

const guestSchema = new mongoose.Schema(
  {
    invitationCode: { type: String, required: true, unique: true, index: true },
    invitationPassword: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    companions: { type: [companionSchema], default: [] },
    qrPayload: { type: String, required: true },
    checkedInAt: { type: Date, default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    linkedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true },
);

export const GuestModel = mongoose.model('Guest', guestSchema);
