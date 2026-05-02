# Backend - Casamento (Convidados + E-commerce de Presentes)

API Node.js + Express + MongoDB para gestão de convidados e um módulo de e-commerce de presentes com checkout Mercado Pago.

## Recursos
- Login com roles (`ADMIN`, `NOIVOS`, `PORTEIRO`, `CONVIDADO`)
- Cadastro de convidados + convite PDF com QRCode
- Check-in por QRCode
- Catálogo de presentes
- Checkout de presentes com Mercado Pago
- Pedidos e conciliação de pagamento via webhook

## Como rodar
1. Copie `.env.example` para `.env`.
2. Instale dependências: `npm install`
3. Suba API: `npm run dev`

## E-commerce de presentes (novo)
### Fluxo
1. Front chama `POST /api/gifts/checkout` com `invitationCode` e `items`.
2. API cria pedido `PENDING` e preferência no Mercado Pago.
3. Front redireciona para `checkoutUrl`.
4. Mercado Pago chama webhook `POST /api/gifts/payments/webhook`.
5. API valida pagamento; se `approved`, marca pedido como `PAID` e reserva os presentes.

### Endpoints principais
- `POST /api/gifts/checkout`
- `POST /api/gifts/payments/webhook`
- `GET /api/gifts/orders/:invitationCode`

> Documentação completa em `API_DOCUMENTACAO.md`.
