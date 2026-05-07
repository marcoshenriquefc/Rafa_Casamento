<template>
  <div class="grid">
    <div class="card">
      <h2>Lista de presentes</h2>
      <p>Selecione o presente usando o ID do seu convite.</p>
    </div>

    <div class="grid grid-2">
      <div class="card" v-for="gift in gifts" :key="gift._id">
        <img v-if="gift.imageUrl" :src="gift.imageUrl" style="width:100%;height:160px;object-fit:cover;border-radius:8px;" />
        <h3>{{ gift.title }}</h3>
        <p>{{ gift.description }}</p>
        <p><strong>R$ {{ gift.price }}</strong></p>
        <p>Disponível: {{ gift.quantity - gift.reservedQuantity }}</p>
      </div>
    </div>

    <div class="card" style="max-width:540px;">
      <h3>Presentear os noivos</h3>
      <div class="grid">
        <div><label>ID do convite</label><input v-model="form.invitationCode" /></div>
        <div><label>ID do presente</label><input v-model="form.giftId" /></div>
        <div><label>Quantidade</label><input v-model.number="form.quantity" type="number" min="1" /></div>
        <button @click="pay">Ir para pagamento Mercado Pago</button>
        <p class="error" v-if="error">{{ error }}</p>
        <p class="success" v-if="success">{{ success }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { giftService } from '../services/giftService';

const gifts = ref([]);
const error = ref('');
const success = ref('');
const form = reactive({ invitationCode: '', giftId: '', quantity: 1 });

const load = async () => {
  const { data } = await giftService.list();
  gifts.value = data;
};

const pay = async () => {
  try {
    error.value = '';
    success.value = '';
    const { data } = await giftService.checkout(form);
    if (!data.checkoutUrl) {
      throw new Error('Link de pagamento não foi retornado.');
    }

    success.value = 'Redirecionando para o Mercado Pago...';
    window.location.href = data.checkoutUrl;
  } catch (err) {
    error.value = err.response?.data?.message || 'Falha ao iniciar pagamento';
  }
};

onMounted(load);
</script>
