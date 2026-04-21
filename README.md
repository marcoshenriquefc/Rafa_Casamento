# Backend - Casamento (Convidados + Presentes)

API inicial em Node.js + Express + MongoDB Atlas para:
- Login com roles (`ADMIN`, `NOIVOS`, `PORTEIRO`, `CONVIDADO`)
- Cadastro de convidados e acompanhantes
- Geração de convite em PDF com QR Code
- Login do convidado por `ID do convite + senha de 5 dígitos`
- Listagem de presentes e seleção (reserva) por convidado
- Check-in na entrada por leitura de QR code (porteiro)

## Stack
- Node.js
- Express
- MongoDB/Mongoose
- JWT
- PDFKit + QRCode

## Como rodar
1. Copie o `.env.example` para `.env` e preencha.
2. Instale dependências:
   ```bash
   npm install
   ```
3. Inicie a API:
   ```bash
   npm run dev
   ```

## Rotas principais

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Convidados
- `GET /api/guests` (ADMIN, NOIVOS)
- `POST /api/guests` (ADMIN, NOIVOS)
- `GET /api/guests/:invitationCode/invitation-pdf` (ADMIN, NOIVOS)
- `POST /api/guests/:invitationCode/login` (público, senha de 5 dígitos)
- `POST /api/guests/:invitationCode/check-in` (ADMIN, PORTEIRO)

### Presentes
- `GET /api/gifts` (público)
- `POST /api/gifts` (ADMIN, NOIVOS)
- `POST /api/gifts/select` (público com invitationCode)

## Fluxo para QR Code e check-in
- O PDF contém QR Code para `FRONTEND_BASE_URL/convite/:invitationCode`.
- No front-end da portaria, a aba "Ler QR Code" deve abrir a câmera do celular e decodificar o `invitationCode`.
- Após ler, o front chama:
  - `POST /api/guests/:invitationCode/check-in`
  - enviando `companionIds` marcados como presentes na entrada.

> O leitor de câmera QR é implementado no front-end (Vue), usando bibliotecas como `html5-qrcode` ou `@zxing/browser`.

## Front-end (Vue)

O front-end foi criado na pasta `frontend/` com integração completa da API.

```bash
cd frontend
npm install
npm run dev
```

Configure `frontend/.env` com `VITE_API_URL` apontando para o backend.
