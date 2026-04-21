import { verifyAccessToken } from '../utils/security.js';
import { HttpError } from '../utils/httpError.js';

export const authenticate = (req, _res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization?.startsWith('Bearer ')) {
    return next(new HttpError(401, 'Token de autenticação ausente.'));
  }

  const token = authorization.replace('Bearer ', '');

  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    return next();
  } catch {
    return next(new HttpError(401, 'Token inválido ou expirado.'));
  }
};

export const authorize = (...roles) => (req, _res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new HttpError(403, 'Você não tem permissão para esta ação.'));
  }
  return next();
};
