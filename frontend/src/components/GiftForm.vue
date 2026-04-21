<template>
  <div class="card">
    <h3>Cadastrar presente</h3>
    <div class="grid" style="margin-top:.8rem;">
      <div><label>Título</label><input v-model="form.title" /></div>
      <div><label>Descrição</label><textarea v-model="form.description" rows="3" /></div>
      <div><label>Imagem URL</label><input v-model="form.imageUrl" /></div>
      <div><label>Preço</label><input v-model.number="form.price" type="number" min="0" /></div>
      <div><label>Quantidade</label><input v-model.number="form.quantity" type="number" min="1" /></div>
      <button class="secondary" @click="submit">Salvar presente</button>
      <p class="error" v-if="error">{{ error }}</p>
      <p class="success" v-if="success">{{ success }}</p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { giftService } from '../services/giftService';

const emit = defineEmits(['created']);
const error = ref('');
const success = ref('');
const form = reactive({ title: '', description: '', imageUrl: '', price: 0, quantity: 1 });

const submit = async () => {
  try {
    error.value = '';
    success.value = '';
    await giftService.create(form);
    success.value = 'Presente cadastrado com sucesso.';
    form.title = '';
    form.description = '';
    form.imageUrl = '';
    form.price = 0;
    form.quantity = 1;
    emit('created');
  } catch (err) {
    error.value = err.response?.data?.message || 'Erro ao cadastrar presente.';
  }
};
</script>
