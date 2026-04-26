import http from './http';

export const authService = {
  login: (payload) => http.post('/auth/login', payload),
  register: (payload) => http.post('/auth/register', payload),
};
