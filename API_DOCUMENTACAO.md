# API DOCUMENTAÇÃO - Sistema Casamento + E-commerce

## Visão geral
Backend REST com autenticação, convidados, convites, check-in e módulo e-commerce para presentear os noivos com checkout Mercado Pago.

## Variáveis de ambiente
- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `FRONTEND_BASE_URL`
- `MP_ACCESS_TOKEN`
- `MP_SUCCESS_URL`
- `MP_FAILURE_URL`
- `MP_PENDING_URL`
- `MP_WEBHOOK_URL`

## Modelos
### Gift
`title, description, imageUrl, price, quantity, reservedQuantity, active`

### Order (novo)
- `guest`: ObjectId de convidado
- `invitationCode`: UUID do convite
- `items`: array de itens (`gift`, `title`, `unitPrice`, `quantity`, `subtotal`)
- `totalAmount`
- `status`: `PENDING | PAID | FAILED | CANCELED`
- `paymentProvider`: `MERCADO_PAGO`
- `paymentId`, `preferenceId`, `externalReference`, `paidAt`, `metadata`

## Rotas de e-commerce
### 1) Criar checkout
`POST /api/gifts/checkout`

Body:
```json
{
  "invitationCode": "uuid",
  "items": [
    { "giftId": "<giftId>", "quantity": 1 }
  ]
}
```

Resposta `201`:
```json
{
  "orderId": "...",
  "checkoutUrl": "https://...",
  "sandboxCheckoutUrl": "https://...",
  "preferenceId": "...",
  "externalReference": "..."
}
```

### 2) Webhook Mercado Pago
`POST /api/gifts/payments/webhook`

Aceita `paymentId` em:
- `body.data.id`
- `query.data.id`
- `query.id`

Comportamento:
- Busca pagamento no MP via SDK.
- Localiza pedido por `externalReference`.
- Se `approved`: marca pedido `PAID`, incrementa `reservedQuantity` dos gifts e cria `GiftSelection`.
- Se `rejected`: `FAILED`.
- Se `cancelled`: `CANCELED`.

Resposta `200`:
```json
{ "received": true }
```

### 3) Listar pedidos por convite
`GET /api/gifts/orders/:invitationCode`

Resposta `200`: lista de pedidos do convite (mais novos primeiro).

## Demais módulos
Rotas anteriores de autenticação, convidados, convites PDF e check-in continuam ativas.
