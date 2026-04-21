# Documentação Completa da API - Sistema de Casamento

Este documento descreve **100% do backend atual** para que qualquer desenvolvedor consiga configurar, executar e consumir a API.

---

## 1) Visão geral

API REST para gerenciamento de casamento com os módulos:

- **Autenticação e autorização por roles**
- **Convidados e acompanhantes**
- **Geração de convite em PDF com QR Code**
- **Portal do convidado via `invitationCode + senha de 5 dígitos`**
- **Lista e seleção de presentes (estilo e-commerce)**
- **Check-in na entrada para porteiro (via QR Code lido no front)**

### Stack atual

- Node.js
- Express
- MongoDB Atlas + Mongoose
- JWT
- Zod (validação)
- PDFKit (geração de PDF)
- qrcode (geração de QR)

---

## 2) Estrutura de pastas

```txt
src/
  app.js
  server.js
  config/
    database.js
  controllers/
    authController.js
    guestController.js
    giftController.js
  middlewares/
    authMiddleware.js
    validateMiddleware.js
    errorHandler.js
  models/
    User.js
    Guest.js
    Gift.js
    GiftSelection.js
  repositories/
    userRepository.js
    guestRepository.js
    giftRepository.js
    giftSelectionRepository.js
  routes/
    index.js
    authRoutes.js
    guestRoutes.js
    giftRoutes.js
  services/
    authService.js
    guestService.js
    giftService.js
  utils/
    security.js
    invitation.js
    pdfGenerator.js
    httpError.js
  validators/
    authSchemas.js
    guestSchemas.js
    giftSchemas.js
    common.js
```

---

## 3) Configuração do ambiente

Crie um `.env` com base no `.env.example`:

```env
PORT=3000
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
JWT_SECRET=super-secret
JWT_EXPIRES_IN=1d
FRONTEND_BASE_URL=http://localhost:5173
```

### Variáveis

- `PORT`: porta da API (default: 3000)
- `MONGO_URI`: string de conexão MongoDB Atlas
- `JWT_SECRET`: segredo de assinatura dos tokens JWT
- `JWT_EXPIRES_IN`: expiração do JWT (ex.: `1d`, `12h`)
- `FRONTEND_BASE_URL`: URL base utilizada no payload do QR do convite

---

## 4) Instalação e execução

```bash
npm install
npm run dev
```

Produção:

```bash
npm start
```

Health check:

```http
GET /health
```

Resposta esperada:

```json
{
  "status": "ok",
  "service": "casamento-backend"
}
```

---

## 5) Autenticação e roles

### Roles disponíveis

- `ADMIN`
- `NOIVOS`
- `PORTEIRO`
- `CONVIDADO`

### Header para rotas protegidas

```http
Authorization: Bearer <token_jwt>
```

### Regras atuais

- **ADMIN**: acesso total
- **NOIVOS**: cadastro de convidados/presentes e geração de convite
- **PORTEIRO**: check-in de entrada
- **CONVIDADO**: usuário vinculado ao convite (fluxo atual usa login por convite para portal)

---

## 6) Entidades (modelos)

## 6.1 User

```ts
{
  name: string;
  email: string; // unique
  passwordHash: string;
  role: 'ADMIN' | 'NOIVOS' | 'PORTEIRO' | 'CONVIDADO';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## 6.2 Guest

```ts
{
  invitationCode: string; // UUID, unique
  invitationPassword: string; // senha de 5 dígitos
  name: string;
  email: string; // unique
  companions: Array<{
    _id: ObjectId;
    name: string;
    checkedInAt: Date | null;
  }>;
  qrPayload: string; // URL do front para o convite
  checkedInAt: Date | null;
  createdBy: ObjectId; // User
  linkedUser: ObjectId | null; // User convidado (role CONVIDADO)
  createdAt: Date;
  updatedAt: Date;
}
```

## 6.3 Gift

```ts
{
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  quantity: number;
  reservedQuantity: number;
  active: boolean;
  createdBy: ObjectId; // User
  createdAt: Date;
  updatedAt: Date;
}
```

## 6.4 GiftSelection

```ts
{
  guest: ObjectId; // Guest
  gift: ObjectId; // Gift
  quantity: number;
  selectedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 7) Fluxo funcional completo

## 7.1 Fluxo Noivos/Admin

1. Faz login.
2. Cadastra convidados e acompanhantes.
3. Gera PDF do convite para cada convidado.
4. Cadastra presentes.

## 7.2 Fluxo Convidado

1. Recebe PDF com QRCode + senha de 5 dígitos.
2. Lê QRCode (abre página do convite no front).
3. Informa senha de 5 dígitos.
4. Front autentica no backend via endpoint de convite.
5. Convidado escolhe presente.

## 7.3 Fluxo Porteiro

1. Abre aba de leitura de QRCode no celular (front).
2. Front captura `invitationCode` do QR.
3. Front chama endpoint de check-in.
4. Sistema marca convidado e acompanhantes presentes.

> Observação: abertura de câmera e leitura de QR por celular é responsabilidade do front-end (Vue). A API já fornece os endpoints necessários.

---

## 8) Endpoints detalhados

Base URL sugerida local: `http://localhost:3000`

## 8.1 Auth

### 8.1.1 Registrar usuário

**POST** `/api/auth/register`

#### Body

```json
{
  "name": "Administrador",
  "email": "admin@casamento.com",
  "password": "12345",
  "role": "ADMIN"
}
```

#### Resposta 201

```json
{
  "user": {
    "id": "...",
    "name": "Administrador",
    "email": "admin@casamento.com",
    "role": "ADMIN"
  },
  "token": "jwt"
}
```

#### Erros comuns

- `409`: email já cadastrado
- `400`: payload inválido

---

### 8.1.2 Login

**POST** `/api/auth/login`

#### Body

```json
{
  "email": "admin@casamento.com",
  "password": "12345"
}
```

#### Resposta 200

```json
{
  "user": {
    "id": "...",
    "name": "Administrador",
    "email": "admin@casamento.com",
    "role": "ADMIN"
  },
  "token": "jwt"
}
```

#### Erros comuns

- `401`: credenciais inválidas

---

## 8.2 Convidados

### 8.2.1 Listar convidados (ADMIN/NOIVOS)

**GET** `/api/guests`

#### Headers

`Authorization: Bearer <token>`

#### Resposta 200

Lista completa de convidados com acompanhantes.

---

### 8.2.2 Criar convidado (ADMIN/NOIVOS)

**POST** `/api/guests`

#### Headers

`Authorization: Bearer <token>`

#### Body

```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "companions": [
    { "name": "Maria Silva" },
    { "name": "Pedro Silva" }
  ]
}
```

#### O que a API faz automaticamente

- Gera `invitationCode` (UUID)
- Gera `invitationPassword` (5 dígitos)
- Gera `qrPayload` apontando para `FRONTEND_BASE_URL/convite/:invitationCode`
- Se não existir usuário para o email, cria usuário `CONVIDADO` com senha igual aos 5 dígitos

#### Resposta 201

Retorna objeto `Guest` completo.

---

### 8.2.3 Gerar PDF do convite (ADMIN/NOIVOS)

**GET** `/api/guests/:invitationCode/invitation-pdf`

#### Headers

`Authorization: Bearer <token>`

#### Resposta 200

- `Content-Type: application/pdf`
- PDF contendo:
  - título do convite
  - nome convidado
  - acompanhantes
  - ID do convite
  - senha de 5 dígitos
  - QRCode

#### Erros comuns

- `404`: convidado não encontrado

---

### 8.2.4 Login no portal via convite

**POST** `/api/guests/:invitationCode/login`

#### Body

```json
{
  "password": "12345"
}
```

#### Resposta 200

```json
{
  "invitationCode": "uuid",
  "guestName": "João Silva",
  "email": "joao@email.com",
  "companions": [
    {
      "_id": "...",
      "name": "Maria Silva",
      "checkedInAt": null
    }
  ]
}
```

#### Erros comuns

- `401`: convite/senha inválidos
- `400`: senha com formato inválido

---

### 8.2.5 Check-in de entrada (ADMIN/PORTEIRO)

**POST** `/api/guests/:invitationCode/check-in`

#### Headers

`Authorization: Bearer <token>`

#### Body

```json
{
  "companionIds": ["<id_acompanhante_1>", "<id_acompanhante_2>"]
}
```

#### Comportamento

- Marca `checkedInAt` do convidado (se ainda não marcado)
- Marca `checkedInAt` de cada acompanhante informado

#### Resposta 200

Objeto `Guest` atualizado.

---

## 8.3 Presentes

### 8.3.1 Listar presentes disponíveis

**GET** `/api/gifts`

#### Resposta 200

Lista de presentes `active: true`.

---

### 8.3.2 Criar presente (ADMIN/NOIVOS)

**POST** `/api/gifts`

#### Headers

`Authorization: Bearer <token>`

#### Body

```json
{
  "title": "Jogo de Pratos",
  "description": "Conjunto 24 peças",
  "imageUrl": "https://example.com/imagem.jpg",
  "price": 399.9,
  "quantity": 3
}
```

#### Resposta 201

Objeto `Gift` criado.

---

### 8.3.3 Selecionar/Reservar presente (portal convidado)

**POST** `/api/gifts/select`

#### Body

```json
{
  "invitationCode": "uuid-do-convite",
  "giftId": "id-do-presente",
  "quantity": 1
}
```

#### Comportamento

- Valida convidado pelo `invitationCode`
- Valida se presente existe e está ativo
- Valida estoque restante (`quantity - reservedQuantity`)
- Incrementa `reservedQuantity`
- Cria `GiftSelection` vinculado ao convidado

#### Resposta 201

Objeto `GiftSelection` criado.

#### Erros comuns

- `404`: convidado ou presente não encontrado
- `400`: quantidade indisponível

---

## 9) Padrão de erros

Quando ocorre erro, a API retorna:

```json
{
  "error": true,
  "message": "Descrição do erro"
}
```

Status comuns:

- `400` validação/payload
- `401` autenticação
- `403` autorização
- `404` recurso não encontrado
- `409` conflito (ex.: e-mail já existente)
- `500` erro interno

---

## 10) Validações implementadas (Zod)

- Auth:
  - `register`: `name`, `email`, `password(min 5)`, `role`
  - `login`: `email`, `password(min 5)`
- Guest:
  - criação com lista de acompanhantes
  - `invitationCode` como UUID
  - senha do convite com 5 dígitos
  - `companionIds` no check-in
- Gift:
  - criação com `title`, `price >= 0`, `quantity > 0`
  - seleção com `invitationCode`, `giftId`, `quantity > 0`

---

## 11) Segurança e boas práticas atuais

- Senhas de usuários armazenadas com hash (`bcrypt`).
- JWT com expiração configurável.
- Separação por camadas facilita manutenção e testes.
- Controle de acesso por role nos endpoints críticos.

### Melhorias recomendadas (próximos passos)

- Rotacionar e guardar segredos em cofre (Vault/Secrets Manager).
- Rate limit em login e endpoints públicos.
- Auditoria detalhada de ações (logs estruturados).
- Refresh token (sessões longas).
- Testes automatizados (unit + integração).
- Paginação/filtros em listagens.
- Upload/armazenamento de backgrounds de convite (S3/Cloudinary).

---

## 12) Integração com Front-end (Vue)

## 12.1 Portal convidado

1. Rota frontend: `/convite/:invitationCode`
2. Form de senha (5 dígitos)
3. Chamar `POST /api/guests/:invitationCode/login`
4. Em sucesso, exibir presentes e chamar `POST /api/gifts/select`

## 12.2 Portaria (leitura QR por câmera)

Sugestão de libs front:
- `html5-qrcode`
- `@zxing/browser`

Fluxo:
1. Abrir câmera do celular
2. Ler QR e extrair `invitationCode`
3. Buscar dados/mostrar convidados e acompanhantes
4. Enviar `POST /api/guests/:invitationCode/check-in`

---

## 13) Exemplos rápidos cURL

### Login admin

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@casamento.com","password":"12345"}'
```

### Criar convidado

```bash
curl -X POST http://localhost:3000/api/guests \
  -H "Authorization: Bearer <TOKEN>" \
  -H 'Content-Type: application/json' \
  -d '{"name":"João","email":"joao@email.com","companions":[{"name":"Maria"}]}'
```

### Gerar PDF convite

```bash
curl -X GET http://localhost:3000/api/guests/<INVITATION_CODE>/invitation-pdf \
  -H "Authorization: Bearer <TOKEN>" \
  --output convite.pdf
```

### Selecionar presente

```bash
curl -X POST http://localhost:3000/api/gifts/select \
  -H 'Content-Type: application/json' \
  -d '{"invitationCode":"<UUID>","giftId":"<GIFT_ID>","quantity":1}'
```

### Check-in porteiro

```bash
curl -X POST http://localhost:3000/api/guests/<INVITATION_CODE>/check-in \
  -H "Authorization: Bearer <TOKEN_PORTEIRO>" \
  -H 'Content-Type: application/json' \
  -d '{"companionIds":["<COMPANION_ID_1>"]}'
```

---

## 14) Estado atual da entrega

O backend já está pronto como **base funcional completa** para:

- Administração por role
- Fluxo de convidados/convites QR/PDF
- Fluxo de presentes com reserva
- Fluxo de check-in da portaria

Para produção, recomenda-se implementar os próximos passos de segurança, observabilidade e testes automatizados citados acima.
