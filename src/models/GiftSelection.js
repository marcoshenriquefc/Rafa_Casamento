import mongoose from 'mongoose';

const giftSelectionSchema = new mongoose.Schema(
  {
    guest: { type: mongoose.Schema.Types.ObjectId, ref: 'Guest', required: true },
    gift: { type: mongoose.Schema.Types.ObjectId, ref: 'Gift', required: true },
    quantity: { type: Number, required: true, min: 1 },
    selectedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export const GiftSelectionModel = mongoose.model('GiftSelection', giftSelectionSchema);
