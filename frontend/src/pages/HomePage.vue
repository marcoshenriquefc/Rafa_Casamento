<template>
  <div class="grid grid-2">
    <section class="card">
      <h1>Bem-vindos ao nosso casamento 💒</h1>
      <p>Gerencie convidados, check-in na portaria e lista de presentes em um só sistema.</p>
      <ul>
        <li><strong>Cerimônia:</strong> 12/12/2026 às 16h</li>
        <li><strong>Festa:</strong> Espaço Jardim das Flores, São Paulo</li>
        <li><strong>Endereço:</strong> Av. Exemplo, 1234</li>
      </ul>
    </section>
    <section class="card">
      <h2>Acesso rápido</h2>
      <div class="grid">
        <router-link to="/presentes"><button>Ver lista de presentes</button></router-link>
        <router-link to="/login"><button class="secondary">Entrar no painel</button></router-link>
        <router-link to="/portaria"><button>Painel da portaria (QR)</button></router-link>
      </div>
    </section>
  </div>
</template>
