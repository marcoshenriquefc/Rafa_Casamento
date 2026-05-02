# Backend - Casamento (Convidados + E-commerce Mercado Pago)

API em Node.js/Express com módulo de convidados e módulo de pagamento via Mercado Pago.

## Integração com qualquer frontend Vue.js
Além das rotas de presentes do projeto, existe uma rota **genérica** para qualquer app Vue:

- `POST /api/payments/preferences`

Essa rota cria uma preferência no Mercado Pago via SDK e devolve `checkoutUrl` para o front redirecionar o usuário.

### Exemplo de payload
```json
{
  "payer": { "name": "Maria", "email": "maria@email.com" },
  "items": [
    { "id": "gift-123", "title": "Jogo de Panelas", "quantity": 1, "unit_price": 350, "currency_id": "BRL" }
  ],
  "externalReference": "pedido-vue-001",
  "backUrls": {
    "success": "https://app-vue.com/pagamento/sucesso",
    "failure": "https://app-vue.com/pagamento/falha",
    "pending": "https://app-vue.com/pagamento/pendente"
  }
}
```

### Resposta
```json
{
  "preferenceId": "...",
  "checkoutUrl": "https://...",
  "sandboxCheckoutUrl": "https://...",
  "externalReference": "pedido-vue-001"
}
```

## Variáveis de ambiente
Use `.env.example` como base. Obrigatório para pagamentos:
- `MP_ACCESS_TOKEN`
- `MP_WEBHOOK_URL`
- `MP_SUCCESS_URL`
- `MP_FAILURE_URL`
- `MP_PENDING_URL`
