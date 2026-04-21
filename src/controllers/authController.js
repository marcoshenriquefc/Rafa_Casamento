import { authService } from '../services/authService.js';

export const authController = {
  async register(req, res, next) {
    try {
      const { user, token } = await authService.register(req.validated.body);
      return res.status(201).json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      });
    } catch (error) {
      return next(error);
    }
  },

  async login(req, res, next) {
    try {
      const { user, token } = await authService.login(req.validated.body);
      return res.status(200).json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      });
    } catch (error) {
      return next(error);
    }
  },
};
