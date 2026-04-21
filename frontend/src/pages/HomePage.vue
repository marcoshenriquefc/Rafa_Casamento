<template>
  <section
    class="hero card"
    :style="{ backgroundImage: `url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }"
  >
    <div class="hero-content">
      <span class="badge">12 de Dezembro de 2026</span>
      <h1>Rafaela & Henrique</h1>
      <p>Uma celebração de amor, família e novos começos.</p>
      <CountdownTimer target-date="2026-12-12T16:00:00-03:00" />
      <div style="display:flex;gap:.7rem;flex-wrap:wrap;justify-content:center;">
        <router-link to="/presentes"><button>Ver presentes</button></router-link>
        <router-link to="/login"><button class="secondary">Área administrativa</button></router-link>
      </div>
    </div>
  </section>

  <section class="grid grid-3" style="margin-top:1rem;">
    <article class="card">
      <h2 class="section-title">Cerimônia</h2>
      <p>Capela Santa Luzia</p>
      <p class="error" style="color:var(--muted);">16:00 • Rua das Flores, 120</p>
    </article>
    <article class="card">
      <h2 class="section-title">Festa</h2>
      <p>Espaço Jardim Imperial</p>
      <p class="error" style="color:var(--muted);">19:00 • Av. Central, 88</p>
    </article>
    <article class="card">
      <h2 class="section-title">Portaria</h2>
      <p>Use seu QR Code do convite para entrada rápida.</p>
      <router-link to="/convite/SEU-ID"><button>Entrar com convite</button></router-link>
    </article>
  </section>
</template>

<script setup>
import CountdownTimer from '../components/CountdownTimer.vue';

const heroImage =
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1800&q=80';
</script>
