<template>
  <div class="countdown">
    <div class="count-card" v-for="item in countdownItems" :key="item.label">
      <strong>{{ item.value }}</strong>
      <span>{{ item.label }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

const props = defineProps({
  targetDate: {
    type: String,
    required: true,
  },
});

const now = ref(new Date());
let timer = null;

const diffMs = computed(() => {
  const target = new Date(props.targetDate).getTime();
  const current = now.value.getTime();
  return Math.max(target - current, 0);
});

const countdownItems = computed(() => {
  const totalSeconds = Math.floor(diffMs.value / 1000);
  const days = Math.floor(totalSeconds / (24 * 3600));
  const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [
    { label: 'Dias', value: String(days).padStart(2, '0') },
    { label: 'Horas', value: String(hours).padStart(2, '0') },
    { label: 'Min', value: String(minutes).padStart(2, '0') },
    { label: 'Seg', value: String(seconds).padStart(2, '0') },
  ];
});

onMounted(() => {
  timer = setInterval(() => {
    now.value = new Date();
  }, 1000);
});

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>
