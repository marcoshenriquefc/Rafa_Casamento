import http from './http';

export const giftService = {
  list: () => http.get('/gifts'),
  create: (payload) => {
    const formData = new FormData();
    formData.append('title', payload.title);
    formData.append('description', payload.description || '');
    formData.append('price', String(payload.price));
    formData.append('quantity', String(payload.quantity));
    if (payload.image) formData.append('image', payload.image);

    return http.post('/gifts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  checkout: (payload) => http.post('/gifts/checkout', payload),
  select: (payload) => http.post('/gifts/select', payload),
};
