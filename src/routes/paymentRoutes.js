import { Router } from 'express';
import { paymentController } from '../controllers/paymentController.js';
import { validate } from '../middlewares/validateMiddleware.js';
import { createPreferenceSchema } from '../validators/paymentSchemas.js';

export const paymentRoutes = Router();

paymentRoutes.post('/preferences', validate(createPreferenceSchema), paymentController.createPreference);
