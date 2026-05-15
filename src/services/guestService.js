import { guestRepository } from '../repositories/guestRepository.js';
import { userRepository } from '../repositories/userRepository.js';
import { HttpError } from '../utils/httpError.js';
import {
  buildGuestPortalUrl,
  buildInvitationCode,
  buildInvitationPassword,
} from '../utils/invitation.js';
import { generateBulkInvitationsPdfBuffer, generateInvitationPdfBuffer } from '../utils/pdfGenerator.js';
import { USER_ROLES } from '../models/User.js';
import { hashPassword, signAccessToken } from '../utils/security.js';

export const guestService = {
  async createGuest({ name, email, companions, createdBy, isBestMan = false }) {
    let invitationCode = buildInvitationCode();
    while (await guestRepository.findByInvitationCode(invitationCode)) {
      invitationCode = buildInvitationCode();
    }

    const invitationPassword = buildInvitationPassword();
    const qrPayload = buildGuestPortalUrl(invitationCode);

    const linkedUser = await userRepository.findByEmail(email);
    const guest = await guestRepository.create({
      invitationCode,
      invitationPassword,
      name,
      email,
      companions,
      isBestMan,
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


  async getAttendanceStatusByInvitationCode(invitationCode) {
    const guest = await guestRepository.findByInvitationCode(invitationCode);
    if (!guest) {
      throw new HttpError(404, 'Convite não encontrado.');
    }

    return {
      invitationCode: guest.invitationCode,
      attendanceConfirmed: Boolean(guest.attendanceConfirmedAt),
    };
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
    if (payload.isBestMan !== undefined) guest.isBestMan = payload.isBestMan;

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

  async exportAllInvitationsPdf() {
    const guests = await guestRepository.list();

    const payload = guests.map((guest) => ({
      name: guest.name,
      invitationCode: guest.invitationCode,
      invitationPassword: guest.invitationPassword,
      companions: guest.companions || [],
      qrPayload: buildGuestPortalUrl(guest.invitationCode),
    }));

    return generateBulkInvitationsPdfBuffer({ guests: payload });
  },

  async listGuests() {
    return guestRepository.list();
  },


  async listAttendanceSummary() {
    const guests = await guestRepository.listByAttendanceStatus();

    const confirmed = guests
      .filter((g) => g.attendanceConfirmedAt)
      .map((g) => ({
        id: g.id,
        invitationCode: g.invitationCode,
        name: g.name,
        email: g.email,
        attendanceConfirmedAt: g.attendanceConfirmedAt,
        confirmedCompanions: g.companions
          .filter((c) => c.attendanceConfirmedAt)
          .map((c) => ({
            id: c._id,
            name: c.name,
            attendanceConfirmedAt: c.attendanceConfirmedAt,
          })),
        companionsConfirmed: g.companions.filter((c) => c.attendanceConfirmedAt).length,
        companionsTotal: g.companions.length,
      }));

    const notConfirmed = guests
      .filter((g) => !g.attendanceConfirmedAt)
      .map((g) => ({
        id: g.id,
        invitationCode: g.invitationCode,
        name: g.name,
        email: g.email,
        companionsConfirmed: g.companions.filter((c) => c.attendanceConfirmedAt).length,
        companionsTotal: g.companions.length,
      }));

    return {
      totals: {
        confirmedGuests: confirmed.length,
        notConfirmedGuests: notConfirmed.length,
        allGuests: guests.length,
      },
      confirmed,
      notConfirmed,
    };
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


  async confirmAttendanceByInvitation({ invitationCode, invitationPassword, companionIds = [] }) {
    const guest = await guestRepository.findByInvitationCode(invitationCode);
    if (!guest || guest.invitationPassword !== invitationPassword) {
      throw new HttpError(401, 'ID do convite ou senha inválidos.');
    }

    guest.attendanceConfirmedAt = guest.attendanceConfirmedAt || new Date();
    guest.companions.forEach((companion) => {
      if (companionIds.includes(String(companion._id))) {
        companion.attendanceConfirmedAt = companion.attendanceConfirmedAt || new Date();
      }
    });

    await guestRepository.save(guest);

    return {
      invitationCode: guest.invitationCode,
      guestName: guest.name,
      attendanceConfirmedAt: guest.attendanceConfirmedAt,
      confirmedCompanions: guest.companions
        .filter((c) => c.attendanceConfirmedAt)
        .map((c) => ({ id: c._id, name: c.name, attendanceConfirmedAt: c.attendanceConfirmedAt })),
    };
  },

  async confirmAttendanceById(guestId, companionIds = []) {
    const guest = await guestRepository.findById(guestId);
    if (!guest) {
      throw new HttpError(404, 'Convidado não encontrado.');
    }

    const now = new Date();
    const companionIdSet = new Set(companionIds.map(String));
    const allCompanionIds = guest.companions.map((companion) => String(companion._id));
    const invalidCompanionIds = [...companionIdSet].filter((id) => !allCompanionIds.includes(id));

    if (invalidCompanionIds.length > 0) {
      throw new HttpError(400, 'Um ou mais acompanhantes informados são inválidos para este convite.');
    }

    guest.attendanceConfirmedAt = guest.attendanceConfirmedAt || now;
    guest.companions.forEach((companion) => {
      companion.attendanceConfirmedAt = companionIdSet.has(String(companion._id)) ? (companion.attendanceConfirmedAt || now) : null;
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

  generateGuestToken(guest) {
    const tokenPayload = {
      guestId: guest.id,
      invitationCode: guest.invitationCode,
    };
    
    return signAccessToken(tokenPayload, '7d');
  },

  async searchGuestsByNameOrEmail(query) {
    const allGuests = await guestRepository.list();
    const lowerCaseQuery = query.toLowerCase();
    return allGuests.filter((guest) => {
      return (
        guest.name.toLowerCase().includes(lowerCaseQuery) ||
        guest.email.toLowerCase().includes(lowerCaseQuery)
      );
    });
  },
};
