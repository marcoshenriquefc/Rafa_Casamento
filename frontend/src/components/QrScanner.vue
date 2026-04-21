<template>
  <div class="card">
    <h3>Leitor de QR Code (Câmera)</h3>
    <div :id="elementId" style="width:100%;max-width:420px;margin-top:1rem;"></div>
    <div style="display:flex;gap:.5rem;margin-top:1rem;">
      <button @click="start">Abrir câmera</button>
      <button class="warn" @click="stop">Parar leitura</button>
    </div>
    <p class="error" v-if="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue';
import { Html5Qrcode } from 'html5-qrcode';

const emit = defineEmits(['decoded']);
const props = defineProps({ elementId: { type: String, default: 'qr-reader' } });

const scanner = ref(null);
const error = ref('');

const parseInvitationCode = (decodedText) => {
  try {
    const parsed = new URL(decodedText);
    return parsed.pathname.split('/').filter(Boolean).pop();
  } catch {
    return decodedText;
  }
};

const start = async () => {
  try {
    error.value = '';
    if (!scanner.value) {
      scanner.value = new Html5Qrcode(props.elementId);
    }

    await scanner.value.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: 250 },
      (decodedText) => emit('decoded', parseInvitationCode(decodedText)),
      () => {},
    );
  } catch (err) {
    error.value = err?.message || 'Não foi possível acessar a câmera.';
  }
};

const stop = async () => {
  if (scanner.value?.isScanning) {
    await scanner.value.stop();
    await scanner.value.clear();
  }
};

onBeforeUnmount(async () => {
  await stop();
});
</script>
