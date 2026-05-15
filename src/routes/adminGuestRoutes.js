import { Router } from 'express';
import { adminGuestController } from '../controllers/adminGuestController.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';
import { USER_ROLES } from '../models/User.js';

export const adminGuestRoutes = Router();

adminGuestRoutes.get(
  '/export-invitations',
  authenticate,
  authorize(USER_ROLES.ADMIN),
  adminGuestController.exportInvitations,
);
