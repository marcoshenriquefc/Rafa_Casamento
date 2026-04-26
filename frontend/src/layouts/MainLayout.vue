<template>
  <header class="header-shell glass">
    <div class="container" style="display:flex;justify-content:space-between;align-items:center;gap:1rem;padding:.8rem 0;">
      <strong style="font-family:'Cormorant Garamond', serif;font-size:1.5rem;">Rafa & Henrique</strong>
      <nav class="nav">
        <router-link to="/">Início</router-link>
        <router-link to="/presentes">Presentes</router-link>
        <router-link to="/portaria">Portaria</router-link>
        <router-link to="/login">Login</router-link>
        <router-link v-if="auth.isAuthenticated" to="/painel">Painel</router-link>
        <a v-if="auth.isAuthenticated" href="#" @click.prevent="logout">Sair</a>
      </nav>
    </div>
  </header>
  <main class="container" style="margin-top:1rem;padding-bottom:2rem;">
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
