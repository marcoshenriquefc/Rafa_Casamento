<template>
  <div class="grid" style="max-width:620px;margin:0 auto;">
    <div class="card">
      <h2>Acesso do convidado</h2>
      <p>Convite: <strong>{{ route.params.invitationCode }}</strong></p>
      <div class="grid" style="margin-top:1rem;">
        <div><label>Senha de 5 dígitos</label><input v-model="password" maxlength="5" /></div>
        <button @click="login">Entrar</button>
      </div>
      <p class="error" v-if="error">{{ error }}</p>
    </div>

    <div class="card" v-if="guest">
      <h3>Olá, {{ guest.guestName }}!</h3>
      <p>Email vinculado: {{ guest.email }}</p>
      <p>Acompanhantes:</p>
      <ul>
        <li v-for="c in guest.companions" :key="c._id">{{ c.name }}</li>
      </ul>
      <router-link to="/presentes"><button class="secondary">Escolher presente</button></router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { guestService } from '../services/guestService';

const route = useRoute();
const password = ref('');
const guest = ref(null);
const error = ref('');

const login = async () => {
  try {
    error.value = '';
    const { data } = await guestService.invitationLogin(route.params.invitationCode, password.value);
    guest.value = data;
  } catch (err) {
    error.value = err.response?.data?.message || 'Falha no acesso do convite';
  }
};
</script>
