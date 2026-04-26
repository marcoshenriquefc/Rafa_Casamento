import { guestService } from '../services/guestService.js';

export const guestController = {
  async create(req, res, next) {
    try {
      const guest = await guestService.createGuest({
        ...req.validated.body,
        createdBy: req.user.sub,
      });
      return res.status(201).json(guest);
    } catch (error) {
      return next(error);
    }
  },

  async list(_req, res, next) {
    try {
      const guests = await guestService.listGuests();
      return res.status(200).json(guests);
    } catch (error) {
      return next(error);
    }
  },

  async getByInvitationCode(req, res, next) {
    try {
      const { invitationCode } = req.validated.params;
      const guest = await guestService.getGuestByInvitationCode(invitationCode);
      return res.status(200).json(guest);
    } catch (error) {
      return next(error);
    }
  },

  async updateByInvitationCode(req, res, next) {
    try {
      const { invitationCode } = req.validated.params;
      const guest = await guestService.updateGuestByInvitationCode(invitationCode, req.validated.body);
      return res.status(200).json(guest);
    } catch (error) {
      return next(error);
    }
  },

  async deleteByInvitationCode(req, res, next) {
    try {
      const { invitationCode } = req.validated.params;
      const result = await guestService.deleteGuestByInvitationCode(invitationCode);
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  },

  async generatePdf(req, res, next) {
    try {
      const { invitationCode } = req.validated.params;
      const buffer = await guestService.generateInvitationPdf(invitationCode);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="convite-${invitationCode}.pdf"`);
      return res.status(200).send(buffer);
    } catch (error) {
      return next(error);
    }
  },

  async invitationLogin(req, res, next) {
    try {
      const { invitationCode } = req.validated.params;
      const guest = await guestService.authenticateGuestByInvitation({
        invitationCode,
        invitationPassword: req.validated.body.password,
      });

      return res.status(200).json({
        invitationCode: guest.invitationCode,
        guestName: guest.name,
        email: guest.email,
        companions: guest.companions,
      });
    } catch (error) {
      return next(error);
    }
  },

  async checkIn(req, res, next) {
    try {
      const { invitationCode } = req.validated.params;
      const { companionIds } = req.validated.body;
      const guest = await guestService.checkInByInvitationCode(invitationCode, companionIds);
      return res.status(200).json(guest);
    } catch (error) {
      return next(error);
    }
  },
};
