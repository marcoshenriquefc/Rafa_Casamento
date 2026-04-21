# Frontend Vue - Sistema de Casamento

## Executar

```bash
cd frontend
npm install
npm run dev
```

## Configuração

Copie `.env.example` para `.env` e ajuste:

```env
VITE_API_URL=http://localhost:3000/api
```

## Telas implementadas

- Home com informações do evento.
- Login administrativo.
- Painel por roles (Admin, Noivos, Porteiro).
- Cadastro de convidados e geração de PDF do convite.
- Cadastro de presentes.
- Página pública de presentes para seleção.
- Página de acesso por convite (`/convite/:invitationCode`) usando senha de 5 dígitos.
- Tela de portaria com leitura de QRCode por câmera (`html5-qrcode`) e check-in.
