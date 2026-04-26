<template>
  <div class="card" style="max-width:460px;margin:0 auto;">
    <h2>Login administrativo</h2>
    <div class="grid" style="margin-top:1rem;">
      <div><label>Email</label><input v-model="form.email" type="email" /></div>
      <div><label>Senha</label><input v-model="form.password" type="password" /></div>
      <button @click="submit">Entrar</button>
      <p class="error" v-if="error">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const router = useRouter();
const auth = useAuthStore();
const error = ref('');
const form = reactive({ email: '', password: '' });

const submit = async () => {
  try {
    error.value = '';
    await auth.login(form);
    router.push('/painel');
  } catch (err) {
    error.value = err.response?.data?.message || 'Falha no login';
  }
};
</script>
