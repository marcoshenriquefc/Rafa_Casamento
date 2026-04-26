import { guestRepository } from '../repositories/guestRepository.js';
import { userRepository } from '../repositories/userRepository.js';
import { HttpError } from '../utils/httpError.js';
import {
  buildGuestPortalUrl,
  buildInvitationCode,
  buildInvitationPassword,
} from '../utils/invitation.js';
import { generateInvitationPdfBuffer } from '../utils/pdfGenerator.js';
import { USER_ROLES } from '../models/User.js';
import { hashPassword } from '../utils/security.js';

export const guestService = {
  async createGuest({ name, email, companions, createdBy }) {
    const invitationCode = buildInvitationCode();
    const invitationPassword = buildInvitationPassword();
    const qrPayload = buildGuestPortalUrl(invitationCode);

    const linkedUser = await userRepository.findByEmail(email);
    const guest = await guestRepository.create({
      invitationCode,
      invitationPassword,
      name,
      email,
      companions,
      qrPayload,
      createdBy,
      linkedUser: linkedUser?.id || null,
    });

    if (!linkedUser) {
      const guestUserPasswordHash = await hashPassword(invitationPassword);
      const guestUser = await userRepository.create({
        name,
        email,
        passwordHash: guestUserPasswordHash,
        role: USER_ROLES.CONVIDADO,
      });
      guest.linkedUser = guestUser.id;
      await guestRepository.save(guest);
    }

    return guest;
  },

  async getGuestByInvitationCode(invitationCode) {
    const guest = await guestRepository.findByInvitationCode(invitationCode);
    if (!guest) {
      throw new HttpError(404, 'Convidado não encontrado.');
    }

    return guest;
  },

  async updateGuestByInvitationCode(invitationCode, payload) {
    const guest = await guestRepository.findByInvitationCode(invitationCode);
    if (!guest) {
      throw new HttpError(404, 'Convidado não encontrado.');
    }

    if (payload.email && payload.email !== guest.email) {
      const emailAlreadyUsedByGuest = await guestRepository.findByEmail(payload.email);
      if (emailAlreadyUsedByGuest && String(emailAlreadyUsedByGuest._id) !== String(guest._id)) {
        throw new HttpError(409, 'Email já está em uso por outro convidado.');
      }

      const linkedUser = guest.linkedUser ? await userRepository.findById(guest.linkedUser) : null;
      if (linkedUser) {
        linkedUser.email = payload.email;
        await userRepository.save(linkedUser);
      }
    }

    if (payload.name !== undefined) guest.name = payload.name;
    if (payload.email !== undefined) guest.email = payload.email;
    if (payload.companions !== undefined) guest.companions = payload.companions;

    await guestRepository.save(guest);
    return guest;
  },

  async deleteGuestByInvitationCode(invitationCode) {
    const guest = await guestRepository.findByInvitationCode(invitationCode);
    if (!guest) {
      throw new HttpError(404, 'Convidado não encontrado.');
    }

    if (guest.linkedUser) {
      const linkedUser = await userRepository.findById(guest.linkedUser);
      if (linkedUser?.role === USER_ROLES.CONVIDADO) {
        await userRepository.deleteById(linkedUser.id);
      }
    }

    await guestRepository.deleteByInvitationCode(invitationCode);
    return { deleted: true, invitationCode };
  },

  async generateInvitationPdf(invitationCode) {
    const guest = await guestRepository.findByInvitationCode(invitationCode);
    if (!guest) {
      throw new HttpError(404, 'Convidado não encontrado.');
    }

    return generateInvitationPdfBuffer({
      guestName: guest.name,
      companions: guest.companions,
      invitationCode: guest.invitationCode,
      invitationPassword: guest.invitationPassword,
      qrPayload: guest.qrPayload,
    });
  },

  async listGuests() {
    return guestRepository.list();
  },

  async checkInByInvitationCode(invitationCode, companionIds = []) {
    const guest = await guestRepository.findByInvitationCode(invitationCode);
    if (!guest) {
      throw new HttpError(404, 'Convite não encontrado.');
    }

    guest.checkedInAt = guest.checkedInAt || new Date();
    guest.companions.forEach((companion) => {
      if (companionIds.includes(String(companion._id))) {
        companion.checkedInAt = companion.checkedInAt || new Date();
      }
    });

    await guestRepository.save(guest);
    return guest;
  },

  async authenticateGuestByInvitation({ invitationCode, invitationPassword }) {
    const guest = await guestRepository.findByInvitationCode(invitationCode);
    if (!guest || guest.invitationPassword !== invitationPassword) {
      throw new HttpError(401, 'ID do convite ou senha inválidos.');
    }

    return guest;
  },
};
