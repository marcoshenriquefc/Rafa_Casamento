import { Router } from 'express';
import { giftController } from '../controllers/giftController.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validateMiddleware.js';
import { checkoutGiftSchema, createGiftSchema, listOrdersSchema } from '../validators/giftSchemas.js';
import { USER_ROLES } from '../models/User.js';

export const giftRoutes = Router();

giftRoutes.get('/', giftController.listAvailable);
giftRoutes.post('/', authenticate, authorize(USER_ROLES.ADMIN, USER_ROLES.NOIVOS), validate(createGiftSchema), giftController.create);
giftRoutes.post('/checkout', validate(checkoutGiftSchema), giftController.createCheckout);
giftRoutes.post('/payments/webhook', giftController.paymentWebhook);
giftRoutes.get('/orders/:invitationCode', validate(listOrdersSchema), giftController.listOrdersByInvitation);
