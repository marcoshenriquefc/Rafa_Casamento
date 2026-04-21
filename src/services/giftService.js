import { giftRepository } from '../repositories/giftRepository.js';
import { giftSelectionRepository } from '../repositories/giftSelectionRepository.js';
import { guestRepository } from '../repositories/guestRepository.js';
import { HttpError } from '../utils/httpError.js';

export const giftService = {
  async createGift(payload) {
    return giftRepository.create(payload);
  },

  async listAvailableGifts() {
    return giftRepository.listActive();
  },

  async selectGift({ invitationCode, giftId, quantity }) {
    const guest = await guestRepository.findByInvitationCode(invitationCode);
    if (!guest) {
      throw new HttpError(404, 'Convidado não encontrado para este convite.');
    }

    const gift = await giftRepository.findById(giftId);
    if (!gift || !gift.active) {
      throw new HttpError(404, 'Presente não encontrado.');
    }

    const remaining = gift.quantity - gift.reservedQuantity;
    if (remaining < quantity) {
      throw new HttpError(400, 'Quantidade indisponível para este presente.');
    }

    gift.reservedQuantity += quantity;
    await giftRepository.save(gift);

    return giftSelectionRepository.create({
      guest: guest.id,
      gift: gift.id,
      quantity,
    });
  },
};
