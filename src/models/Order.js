import mongoose from 'mongoose';

export const ORDER_STATUS = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  FAILED: 'FAILED',
  CANCELED: 'CANCELED',
};

const orderItemSchema = new mongoose.Schema(
  {
    gift: { type: mongoose.Schema.Types.ObjectId, ref: 'Gift', required: true },
    title: { type: String, required: true },
    unitPrice: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    subtotal: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    guest: { type: mongoose.Schema.Types.ObjectId, ref: 'Guest', required: true },
    invitationCode: { type: String, required: true, index: true },
    items: { type: [orderItemSchema], required: true },
    totalAmount: { type: Number, required: true, min: 0 },
    status: { type: String, enum: Object.values(ORDER_STATUS), default: ORDER_STATUS.PENDING },
    paymentProvider: { type: String, default: 'MERCADO_PAGO' },
    paymentId: { type: String, default: null },
    preferenceId: { type: String, default: null },
    externalReference: { type: String, required: true, unique: true, index: true },
    paidAt: { type: Date, default: null },
    metadata: { type: Object, default: {} },
  },
  { timestamps: true },
);

export const OrderModel = mongoose.model('Order', orderSchema);
