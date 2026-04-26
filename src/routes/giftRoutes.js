import { Router } from 'express';
import { giftController } from '../controllers/giftController.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validateMiddleware.js';
import { createGiftSchema, selectGiftSchema } from '../validators/giftSchemas.js';
import { USER_ROLES } from '../models/User.js';

export const giftRoutes = Router();

giftRoutes.get('/', giftController.listAvailable);
giftRoutes.post('/', authenticate, authorize(USER_ROLES.ADMIN, USER_ROLES.NOIVOS), validate(createGiftSchema), giftController.create);
giftRoutes.post('/select', validate(selectGiftSchema), giftController.select);
