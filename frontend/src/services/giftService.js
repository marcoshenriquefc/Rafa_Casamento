import http from './http';

export const giftService = {
  list: () => http.get('/gifts'),
  create: (payload) => http.post('/gifts', payload),
  select: (payload) => http.post('/gifts/select', payload),
};
