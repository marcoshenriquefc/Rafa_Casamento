<template>
  <div class="card">
    <h3>Cadastrar convidado</h3>
    <div class="grid" style="margin-top:.8rem;">
      <div>
        <label>Nome</label>
        <input v-model="form.name" />
      </div>
      <div>
        <label>Email</label>
        <input v-model="form.email" type="email" />
      </div>
      <div>
        <label>Acompanhantes (um por linha)</label>
        <textarea v-model="companionsText" rows="4" />
      </div>
      <button @click="submit">Salvar convidado</button>
      <p class="error" v-if="error">{{ error }}</p>
      <p class="success" v-if="success">{{ success }}</p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { guestService } from '../services/guestService';

const emit = defineEmits(['created']);

const form = reactive({ name: '', email: '' });
const companionsText = ref('');
const error = ref('');
const success = ref('');

const submit = async () => {
  try {
    error.value = '';
    success.value = '';
    const companions = companionsText.value
      .split('\n')
      .map((name) => name.trim())
      .filter(Boolean)
      .map((name) => ({ name }));

    await guestService.create({ ...form, companions });
    success.value = 'Convidado cadastrado com sucesso.';
    form.name = '';
    form.email = '';
    companionsText.value = '';
    emit('created');
  } catch (err) {
    error.value = err.response?.data?.message || 'Erro ao cadastrar convidado.';
  }
};
</script>
