import { HttpError } from '../utils/httpError.js';

export const validate = (schema) => (req, _res, next) => {
  const parsed = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query,
  });

  if (!parsed.success) {
    const message = parsed.error.issues.map((issue) => issue.message).join(', ');
    return next(new HttpError(400, message));
  }

  req.validated = parsed.data;
  return next();
};
