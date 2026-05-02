import { giftRepository } from '../repositories/giftRepository.js';
import { giftSelectionRepository } from '../repositories/giftSelectionRepository.js';
import { guestRepository } from '../repositories/guestRepository.js';
import { orderRepository } from '../repositories/orderRepository.js';
import { ORDER_STATUS } from '../models/Order.js';
import { HttpError } from '../utils/httpError.js';
import { mercadoPagoService } from './mercadoPagoService.js';

const validateStock = (gift, quantity) => {
  const remaining = gift.quantity - gift.reservedQuantity;
  if (remaining < quantity) throw new HttpError(400, `Quantidade indisponível para ${gift.title}.`);
};

export const giftService = {
  async createGift(payload) {
    return giftRepository.create(payload);
  },

  async listAvailableGifts() {
    return giftRepository.listActive();
  },

  async createCheckout({ invitationCode, giftId}) {
    const quantity = 1; // Para simplificar, cada checkout é para um presente. Pode ser expandido para múltiplos itens no futuro.

    const guest = await guestRepository.findByInvitationCode(invitationCode);
    if (!guest) throw new HttpError(404, 'Convidado não encontrado para este convite.');

    const gift = await giftRepository.findById(giftId);
    if (!gift || !gift.active) throw new HttpError(404, 'Presente não encontrado.');
    validateStock(gift, quantity);

    const subtotal = Number(gift.price) * quantity;
    const orderItems = [{
      gift: gift.id,
      title: gift.title,
      unitPrice: Number(gift.price),
      quantity,
      subtotal,
    }];

    const externalReference = `${invitationCode}:${Date.now()}`;
    const order = await orderRepository.create({
      guest: guest.id,
      invitationCode,
      items: orderItems,
      totalAmount: subtotal,
      externalReference,
      status: ORDER_STATUS.PENDING,
    });

    const mpItems = [{
      id: String(gift.id),
      title: gift.title,
      quantity,
      currency_id: 'BRL',
      unit_price: Number(gift.price)
    }];
    const preference = await mercadoPagoService.createGiftPreference({ guest, items: mpItems, externalReference });

    order.preferenceId = preference.id;
    await orderRepository.save(order);

    return {
      orderId: order.id,
      gift: {
        id: gift.id,
        title: gift.title,
        unitPrice: Number(gift.price),
        quantity,
      },
      totalAmount: subtotal,
      checkoutUrl: preference.init_point,
      sandboxCheckoutUrl: preference.sandbox_init_point,
      preferenceId: preference.id,
      externalReference,
    };
  },

  async processMercadoPagoWebhook({ paymentId }) {
    if (!paymentId) return { ignored: true };

    const payment = await mercadoPagoService.getPayment(paymentId);
    const externalReference = payment.external_reference;
    if (!externalReference) return { ignored: true };

    const order = await orderRepository.findByExternalReference(externalReference);
    if (!order || order.status === ORDER_STATUS.PAID) return { ignored: true };

    const status = payment.status;
    order.paymentId = String(payment.id);
    order.metadata = payment;

    if (status === 'approved') {
      for (const item of order.items) {
        const gift = await giftRepository.findById(item.gift);
        if (!gift) throw new HttpError(404, 'Presente não encontrado para confirmação de pagamento.');
        validateStock(gift, item.quantity);
        gift.reservedQuantity += item.quantity;
        await giftRepository.save(gift);
        await giftSelectionRepository.create({ guest: order.guest, gift: gift.id, quantity: item.quantity });
      }

      order.status = ORDER_STATUS.PAID;
      order.paidAt = new Date();
    } else if (status === 'rejected') {
      order.status = ORDER_STATUS.FAILED;
    } else if (status === 'cancelled') {
      order.status = ORDER_STATUS.CANCELED;
    }

    await orderRepository.save(order);
    return { updated: true, status: order.status };
  },

  async listOrdersByInvitation(invitationCode) {
    return orderRepository.listByInvitationCode(invitationCode);
  },
};
