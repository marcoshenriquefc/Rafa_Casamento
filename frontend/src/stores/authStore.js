import { defineStore } from 'pinia';
import { authService } from '../services/authService';

const initialUser = () => {
  const raw = localStorage.getItem('casamento_user');
  return raw ? JSON.parse(raw) : null;
};

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: initialUser(),
    token: localStorage.getItem('casamento_token') || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    async login(payload) {
      const { data } = await authService.login(payload);
      this.user = data.user;
      this.token = data.token;
      localStorage.setItem('casamento_token', data.token);
      localStorage.setItem('casamento_user', JSON.stringify(data.user));
    },
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('casamento_token');
      localStorage.removeItem('casamento_user');
    },
  },
});
