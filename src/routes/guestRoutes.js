import { Router } from 'express';
import { guestController } from '../controllers/guestController.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validateMiddleware.js';
import {
  checkInSchema,
  createGuestSchema,
  guestPortalAuthSchema,
  invitationCodeParamSchema,
} from '../validators/guestSchemas.js';
import { USER_ROLES } from '../models/User.js';

export const guestRoutes = Router();

guestRoutes.get('/', authenticate, authorize(USER_ROLES.ADMIN, USER_ROLES.NOIVOS), guestController.list);
guestRoutes.post('/', authenticate, authorize(USER_ROLES.ADMIN, USER_ROLES.NOIVOS), validate(createGuestSchema), guestController.create);
guestRoutes.get(
  '/:invitationCode/invitation-pdf',
  authenticate,
  authorize(USER_ROLES.ADMIN, USER_ROLES.NOIVOS),
  validate(invitationCodeParamSchema),
  guestController.generatePdf,
);
guestRoutes.post('/:invitationCode/login', validate(guestPortalAuthSchema), guestController.invitationLogin);
guestRoutes.post(
  '/:invitationCode/check-in',
  authenticate,
  authorize(USER_ROLES.ADMIN, USER_ROLES.PORTEIRO),
  validate(checkInSchema),
  guestController.checkIn,
);
