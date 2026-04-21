<template>
  <header class="header">
    <div class="container" style="display:flex;justify-content:space-between;align-items:center;gap:1rem;">
      <strong>Casamento Rafa 💍</strong>
      <nav class="nav">
        <router-link to="/">Home</router-link>
        <router-link to="/presentes">Presentes</router-link>
        <router-link to="/login">Login</router-link>
        <router-link v-if="auth.isAuthenticated" to="/painel">Painel</router-link>
        <a v-if="auth.isAuthenticated" href="#" @click.prevent="logout">Sair</a>
      </nav>
    </div>
  </header>
  <main class="container" style="margin-top:1rem;">
    <slot />
  </main>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const auth = useAuthStore();
const router = useRouter();

const logout = () => {
  auth.logout();
  router.push('/login');
};
</script>
