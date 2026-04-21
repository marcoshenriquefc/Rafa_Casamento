import { userRepository } from '../repositories/userRepository.js';
import { HttpError } from '../utils/httpError.js';
import { comparePassword, hashPassword, signAccessToken } from '../utils/security.js';

export const authService = {
  async register({ name, email, password, role }) {
    const exists = await userRepository.findByEmail(email);
    if (exists) {
      throw new HttpError(409, 'Email já cadastrado.');
    }

    const passwordHash = await hashPassword(password);
    const user = await userRepository.create({ name, email, passwordHash, role });

    return {
      user,
      token: signAccessToken({ sub: user.id, role: user.role, email: user.email }),
    };
  },

  async login({ email, password }) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new HttpError(401, 'Credenciais inválidas.');
    }

    const validPassword = await comparePassword(password, user.passwordHash);
    if (!validPassword) {
      throw new HttpError(401, 'Credenciais inválidas.');
    }

    return {
      user,
      token: signAccessToken({ sub: user.id, role: user.role, email: user.email }),
    };
  },
};
