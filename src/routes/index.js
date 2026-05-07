import { Router } from 'express';
import { authRoutes } from './authRoutes.js';
import { guestRoutes } from './guestRoutes.js';
import { giftRoutes } from './giftRoutes.js';
import { paymentRoutes } from './paymentRoutes.js';

export const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/guests', guestRoutes);
apiRouter.use('/gifts', giftRoutes);

apiRouter.use('/payments', paymentRoutes);
