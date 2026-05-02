# Documentação Técnica Completa - Backend Casamento + E-commerce de Presentes

## 1. Visão geral
API REST em Node.js/Express para:
- autenticação e autorização por perfis;
- gestão de convidados e acompanhantes;
- geração de convite PDF com QR Code;
- check-in por convite;
- catálogo de presentes;
- checkout de presentes com Mercado Pago (SDK no backend);
- pedidos e conciliação de pagamento via webhook.

Base path: `/api`

---

## 2. Stack e arquitetura
- **Runtime:** Node.js (ESM)
- **Framework:** Express
- **Banco:** MongoDB + Mongoose
- **Auth:** JWT
- **Validação:** Zod
- **Pagamentos:** SDK Mercado Pago (`mercadopago`)
- **PDF:** PDFKit + QRCode

Arquitetura em camadas:
`routes -> controllers -> services -> repositories -> models`.

---

## 3. Configuração
### 3.1 Variáveis de ambiente
```env
PORT=3000
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
JWT_SECRET=super-secret
JWT_EXPIRES_IN=1d
FRONTEND_BASE_URL=http://localhost:5173

MP_ACCESS_TOKEN=TEST-xxxxxxxxxxxxxxxxxxxx
MP_SUCCESS_URL=http://localhost:5173/pagamento/sucesso
MP_FAILURE_URL=http://localhost:5173/pagamento/falha
MP_PENDING_URL=http://localhost:5173/pagamento/pendente
MP_WEBHOOK_URL=https://seu-dominio.com/api/gifts/payments/webhook
```

### 3.2 Execução
```bash
npm install
npm run dev
```

Health checks:
- `GET /`
- `GET /health`

---

## 4. Segurança e padrões
## 4.1 Regras de autenticação
Header para rotas protegidas:
```http
Authorization: Bearer <jwt>
```

Perfis disponíveis:
- `ADMIN`
- `NOIVOS`
- `PORTEIRO`
- `CONVIDADO`

## 4.2 Regra crítica de pagamento
**Nunca confiar no frontend.** O front envia apenas IDs (`giftId`, `invitationCode`, `quantity`), e o backend busca item e preço reais no banco para enviar ao Mercado Pago.

## 4.3 Formato de erro padrão
```json
{
  "error": true,
  "message": "Mensagem de erro"
}
```

---

## 5. Modelos de dados
## 5.1 User
```ts
{
  name: string;
  email: string; // único
  passwordHash: string;
  role: 'ADMIN' | 'NOIVOS' | 'PORTEIRO' | 'CONVIDADO';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## 5.2 Guest
```ts
{
  invitationCode: string; // UUID único
  invitationPassword: string; // 5 dígitos
  name: string;
  email: string; // único
  companions: Array<{ _id: ObjectId; name: string; checkedInAt: Date | null }>;
  qrPayload: string;
  checkedInAt: Date | null;
  createdBy: ObjectId;
  linkedUser: ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}
```

## 5.3 Gift
```ts
{
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  quantity: number;
  reservedQuantity: number;
  active: boolean;
  createdBy: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
```

## 5.4 GiftSelection
```ts
{
  guest: ObjectId;
  gift: ObjectId;
  quantity: number;
  selectedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

## 5.5 Order
```ts
{
  guest: ObjectId;
  invitationCode: string;
  items: Array<{ gift: ObjectId; title: string; unitPrice: number; quantity: number; subtotal: number }>;
  totalAmount: number;
  status: 'PENDING' | 'PAID' | 'FAILED' | 'CANCELED';
  paymentProvider: 'MERCADO_PAGO';
  paymentId: string | null;
  preferenceId: string | null;
  externalReference: string; // único
  paidAt: Date | null;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 6. Endpoints completos

## 6.1 Auth
### POST `/api/auth/register`
Cria usuário.

Body:
```json
{ "name": "Admin", "email": "admin@email.com", "password": "12345", "role": "ADMIN" }
```

200/201 Response:
```json
{
  "user": { "id": "...", "name": "Admin", "email": "admin@email.com", "role": "ADMIN" },
  "token": "jwt"
}
```

### POST `/api/auth/login`
Body:
```json
{ "email": "admin@email.com", "password": "12345" }
```

Response:
```json
{
  "user": { "id": "...", "name": "Admin", "email": "admin@email.com", "role": "ADMIN" },
  "token": "jwt"
}
```

---

## 6.2 Guests
### GET `/api/guests` (ADMIN, NOIVOS)
Lista convidados.

### POST `/api/guests` (ADMIN, NOIVOS)
Body:
```json
{
  "name": "João",
  "email": "joao@email.com",
  "companions": [{ "name": "Maria" }]
}
```

### GET `/api/guests/:invitationCode` (ADMIN, NOIVOS, PORTEIRO)
Retorna dados por código do convite.

### PATCH `/api/guests/:invitationCode` (ADMIN, NOIVOS)
Body (ao menos um campo):
```json
{ "name": "João Atualizado" }
```

### DELETE `/api/guests/:invitationCode` (ADMIN, NOIVOS)
Response:
```json
{ "success": true }
```

### GET `/api/guests/:invitationCode/invitation-pdf` (ADMIN, NOIVOS)
Retorna PDF (`Content-Type: application/pdf`).

### POST `/api/guests/:invitationCode/login` (público)
Body:
```json
{ "password": "12345" }
```
Response:
```json
{
  "invitationCode": "uuid",
  "guestName": "João",
  "email": "joao@email.com",
  "companions": []
}
```

### POST `/api/guests/:invitationCode/check-in` (ADMIN, PORTEIRO)
Body:
```json
{ "companionIds": ["...", "..."] }
```
Response: convidado atualizado com `checkedInAt`.

---

## 6.3 Gifts
### GET `/api/gifts`
Lista presentes ativos.

### POST `/api/gifts` (ADMIN, NOIVOS)
Body:
```json
{
  "title": "Jogo de Panelas",
  "description": "Aço inox",
  "imageUrl": "https://...",
  "price": 350,
  "quantity": 3
}
```

### POST `/api/gifts/checkout`
Checkout seguro (backend define preço/item):
```json
{ "invitationCode": "uuid", "giftId": "665f...", "quantity": 1 }
```
Response:
```json
{
  "orderId": "...",
  "gift": { "id": "...", "title": "Jogo de Panelas", "unitPrice": 350, "quantity": 1 },
  "totalAmount": 350,
  "checkoutUrl": "https://...",
  "sandboxCheckoutUrl": "https://...",
  "preferenceId": "...",
  "externalReference": "..."
}
```

### POST `/api/gifts/payments/webhook`
Webhook Mercado Pago. Aceita `paymentId` via:
- `body.data.id`
- `query['data.id']`
- `query.id`

Response:
```json
{ "received": true }
```

### GET `/api/gifts/orders/:invitationCode`
Lista pedidos por convite (mais recentes primeiro).

---

## 6.4 Payments (rota de integração para qualquer app Vue)
### POST `/api/payments/preferences`
Sem confiar no front: apenas IDs e quantidade.

Body:
```json
{ "invitationCode": "uuid", "giftId": "665f...", "quantity": 1 }
```

Response: mesmo contrato de `/api/gifts/checkout`.

---

## 7. Fluxos de uso (passo a passo)
## 7.1 Fluxo completo de compra
1. Front lista presentes: `GET /api/gifts`.
2. Usuário escolhe item.
3. Front chama `POST /api/payments/preferences` com `invitationCode`, `giftId`, `quantity`.
4. Front redireciona para `checkoutUrl`.
5. Mercado Pago dispara webhook.
6. Backend consulta pagamento:
   - `approved` -> pedido `PAID`, reserva item e cria `GiftSelection`;
   - `rejected` -> `FAILED`;
   - `cancelled` -> `CANCELED`.

## 7.2 Fluxo check-in
1. Porteiro lê QR no frontend.
2. Front chama `POST /api/guests/:invitationCode/check-in`.
3. Backend marca convidado/acompanhantes.

---

## 8. Exemplos de integração Vue.js
### 8.1 Criar preferência e redirecionar
```js
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:3000/api' });

async function pagarPresente(invitationCode, giftId, quantity = 1) {
  const { data } = await api.post('/payments/preferences', {
    invitationCode,
    giftId,
    quantity,
  });

  window.location.href = data.checkoutUrl;
}
```

### 8.2 Consultar pedidos
```js
async function listarPedidos(invitationCode) {
  const { data } = await api.get(`/gifts/orders/${invitationCode}`);
  return data;
}
```

---

## 9. Códigos HTTP esperados
- `200`: sucesso de leitura/ação.
- `201`: recurso criado (registro, checkout/pedido).
- `400`: validação/regra de negócio.
- `401`: token ausente/inválido.
- `403`: sem permissão por role.
- `404`: recurso não encontrado.
- `500`: erro interno/configuração.

---

## 10. Observações técnicas finais
- Validação de payload acontece centralizada com middleware `validate` (Zod).
- Autorização por role acontece no middleware `authorize`.
- Erros são padronizados no `errorHandler`.
- Mercado Pago sempre é acionado pelo backend; frontend nunca envia preço final.
