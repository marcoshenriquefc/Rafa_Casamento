import { Router } from 'express';
import { authController } from '../controllers/authController.js';
import { validate } from '../middlewares/validateMiddleware.js';
import { loginSchema, registerSchema } from '../validators/authSchemas.js';

export const authRoutes = Router();

authRoutes.post('/register', validate(registerSchema), authController.register);
authRoutes.post('/login', validate(loginSchema), authController.login);
