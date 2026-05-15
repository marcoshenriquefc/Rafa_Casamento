import { guestService } from '../services/guestService.js';

export const adminGuestController = {
  async exportInvitations(req, res, next) {
    try {
      const buffer = await guestService.exportAllInvitationsPdf();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="convites-convidados.pdf"');
      return res.status(200).send(buffer);
    } catch (error) {
      return next(error);
    }
  },
};
