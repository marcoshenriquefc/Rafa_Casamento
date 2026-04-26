import http from './http';

export const guestService = {
  list: () => http.get('/guests'),
  create: (payload) => http.post('/guests', payload),
  generatePdfUrl: (invitationCode) => `${http.defaults.baseURL}/guests/${invitationCode}/invitation-pdf`,
  invitationLogin: (invitationCode, password) => http.post(`/guests/${invitationCode}/login`, { password }),
  checkIn: (invitationCode, companionIds) => http.post(`/guests/${invitationCode}/check-in`, { companionIds }),
};
