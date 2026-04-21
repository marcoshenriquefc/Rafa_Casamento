<template>
  <div class="grid">
    <div class="card">
      <h2>Painel</h2>
      <p>Usuário: <strong>{{ auth.user?.name }}</strong> <span class="badge">{{ auth.user?.role }}</span></p>
    </div>

    <div v-if="canManageGuests" class="grid grid-2">
      <GuestForm @created="loadGuests" />
      <div class="card">
        <h3>Convidados cadastrados</h3>
        <table class="table" style="margin-top:.8rem;">
          <thead>
            <tr><th>Nome</th><th>Email</th><th>Acompanhantes</th><th>Convite</th></tr>
          </thead>
          <tbody>
            <tr v-for="g in guests" :key="g._id">
              <td>{{ g.name }}</td>
              <td>{{ g.email }}</td>
              <td>{{ g.companions?.length || 0 }}</td>
              <td>
                <a :href="pdfUrl(g.invitationCode)" target="_blank"><button>PDF</button></a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="canManageGifts" class="grid grid-2">
      <GiftForm @created="loadGifts" />
      <div class="card">
        <h3>Presentes cadastrados</h3>
        <table class="table" style="margin-top:.8rem;">
          <thead>
            <tr><th>Título</th><th>Preço</th><th>Disponível</th></tr>
          </thead>
          <tbody>
            <tr v-for="gift in gifts" :key="gift._id">
              <td>{{ gift.title }}</td>
              <td>R$ {{ gift.price }}</td>
              <td>{{ gift.quantity - gift.reservedQuantity }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="canCheckIn" class="card">
      <h3>Portaria</h3>
      <p>Você pode acessar o leitor de QR pelo link abaixo:</p>
      <router-link to="/portaria"><button class="secondary">Abrir painel de check-in</button></router-link>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import GuestForm from '../components/GuestForm.vue';
import GiftForm from '../components/GiftForm.vue';
import { useAuthStore } from '../stores/authStore';
import { guestService } from '../services/guestService';
import { giftService } from '../services/giftService';

const auth = useAuthStore();
const guests = ref([]);
const gifts = ref([]);

const canManageGuests = computed(() => ['ADMIN', 'NOIVOS'].includes(auth.user?.role));
const canManageGifts = computed(() => ['ADMIN', 'NOIVOS'].includes(auth.user?.role));
const canCheckIn = computed(() => ['ADMIN', 'PORTEIRO'].includes(auth.user?.role));

const loadGuests = async () => {
  if (!canManageGuests.value) return;
  const { data } = await guestService.list();
  guests.value = data;
};

const loadGifts = async () => {
  if (!canManageGifts.value) return;
  const { data } = await giftService.list();
  gifts.value = data;
};

const pdfUrl = (invitationCode) => guestService.generatePdfUrl(invitationCode);

onMounted(async () => {
  await Promise.all([loadGuests(), loadGifts()]);
});
</script>
