import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const HomePage = () => import('../pages/HomePage.vue');
const LoginPage = () => import('../pages/LoginPage.vue');
const DashboardPage = () => import('../pages/DashboardPage.vue');
const GiftsPage = () => import('../pages/GiftsPage.vue');
const InvitationAccessPage = () => import('../pages/InvitationAccessPage.vue');
const GateCheckinPage = () => import('../pages/GateCheckinPage.vue');

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomePage },
    { path: '/login', component: LoginPage },
    { path: '/painel', component: DashboardPage, meta: { requiresAuth: true } },
    { path: '/presentes', component: GiftsPage },
    { path: '/convite/:invitationCode', component: InvitationAccessPage },
    { path: '/portaria', component: GateCheckinPage, meta: { requiresAuth: true, roles: ['PORTEIRO', 'ADMIN'] } },
  ],
});

router.beforeEach((to) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return '/login';
  }
  if (to.meta.roles?.length && !to.meta.roles.includes(auth.user?.role)) {
    return '/painel';
  }
  return true;
});

export default router;
