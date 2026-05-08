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


  async attendanceSummary(_req, res, next) {
    try {
      const summary = await guestService.listAttendanceSummary();
      return res.status(200).json(summary);
    } catch (error) {
      return next(error);
    }
  },


  async attendanceStatus(req, res, next) {
    try {
      const { invitationCode } = req.validated.params;
      const status = await guestService.getAttendanceStatusByInvitationCode(invitationCode);
      return res.status(200).json(status);
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

      const token = guestService.generateGuestToken(guest);

      return res.status(200).json({
        invitationCode: guest.invitationCode,
        guestName: guest.name,
        email: guest.email,
        companions: guest.companions,
        isBestMan: guest.isBestMan,
        attendanceConfirmedAt: guest.attendanceConfirmedAt,
        token: token,
      });
    }
    catch (error) {
      return next(error);
    }
  },


  async confirmAttendance(req, res, next) {
    const invitationCode = req.guest?.invitationCode;
    const guestId = req.guest?.id;
    if (!invitationCode || !guestId) {
      return res.status(401).json({ message: 'Token de autenticação ausente' });
    }

    try {
      const result = await guestService.confirmAttendanceById(guestId);
      return res.status(200).json({
        error: false,
        message: 'Presença confirmada com sucesso!',
        invitationCode: result.invitationCode,
      });
    }
    catch (error) {
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

  // Documentação: Exemplo de uso do endpoint de busca por nome ou email
  // GET /guests/search?q=Maria
  // Retorna uma lista de convidados cujo nome ou email contenha "Maria" (case-insensitive)
  async searchByNameOrEmail(req, res, next) {
    try {
      const { query } = req.query;
      console.log(query);
      const results = await guestService.searchGuestsByNameOrEmail(query);
      return res.status(200).json(results);
    }
    catch (error) {
      return next(error);
    }
  },
};
