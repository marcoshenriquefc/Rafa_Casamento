# API Documentação

## Pagamentos Mercado Pago (SDK no backend)

### Rota genérica para integração com qualquer Vue.js
`POST /api/payments/preferences`

Cria uma preferência de checkout no Mercado Pago e retorna a URL para redirecionamento no frontend.

#### Body
```json
{
  "payer": { "name": "Cliente", "email": "cliente@email.com" },
  "items": [
    {
      "id": "sku-001",
      "title": "Produto",
      "quantity": 1,
      "unit_price": 99.9,
      "currency_id": "BRL"
    }
  ],
  "externalReference": "order-001",
  "metadata": { "origem": "vue-app" },
  "backUrls": {
    "success": "https://seu-front/sucesso",
    "failure": "https://seu-front/falha",
    "pending": "https://seu-front/pendente"
  }
}
```

#### Response 201
```json
{
  "preferenceId": "123",
  "checkoutUrl": "https://www.mercadopago.com/...",
  "sandboxCheckoutUrl": "https://sandbox.mercadopago.com/...",
  "externalReference": "order-001"
}
```

## E-commerce de presentes do sistema
- `POST /api/gifts/checkout`
- `POST /api/gifts/payments/webhook`
- `GET /api/gifts/orders/:invitationCode`

## Variáveis de ambiente de pagamento
- `MP_ACCESS_TOKEN`
- `MP_WEBHOOK_URL`
- `MP_SUCCESS_URL`
- `MP_FAILURE_URL`
- `MP_PENDING_URL`
