<template>
  <div class="grid grid-2">
    <QrScanner element-id="gate-qr" @decoded="onDecoded" />

    <div class="card">
      <h3>Check-in da portaria</h3>
      <div class="grid">
        <div><label>ID do convite</label><input v-model="invitationCode" /></div>
        <button @click="fetchGuest">Buscar convidado</button>
      </div>

      <div v-if="guest" style="margin-top:1rem;">
        <p><strong>{{ guest.name }}</strong> - {{ guest.email }}</p>
        <p>Selecione acompanhantes que chegaram:</p>
        <div v-for="comp in guest.companions" :key="comp._id" style="display:flex;gap:.5rem;align-items:center;">
          <input type="checkbox" :value="comp._id" v-model="selectedCompanions" style="width:auto;" />
          <span>{{ comp.name }}</span>
        </div>
        <button class="secondary" style="margin-top:1rem;" @click="checkin">Confirmar check-in</button>
      </div>

      <p class="error" v-if="error">{{ error }}</p>
      <p class="success" v-if="success">{{ success }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import QrScanner from '../components/QrScanner.vue';
import { guestService } from '../services/guestService';

const invitationCode = ref('');
const guest = ref(null);
const selectedCompanions = ref([]);
const error = ref('');
const success = ref('');

const onDecoded = (code) => {
  invitationCode.value = code;
  fetchGuest();
};

const fetchGuest = async () => {
  try {
    error.value = '';
    success.value = '';
    const { data } = await guestService.list();
    guest.value = data.find((g) => g.invitationCode === invitationCode.value) || null;
    if (!guest.value) {
      error.value = 'Convite não encontrado na lista.';
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Erro ao buscar convidado';
  }
};

const checkin = async () => {
  try {
    error.value = '';
    success.value = '';
    await guestService.checkIn(invitationCode.value, selectedCompanions.value);
    success.value = 'Check-in realizado com sucesso.';
  } catch (err) {
    error.value = err.response?.data?.message || 'Erro ao fazer check-in';
  }
};
</script>
