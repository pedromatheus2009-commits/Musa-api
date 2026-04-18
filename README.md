# MUSA — API

REST API da plataforma MUSA. Node.js + Express + Prisma + PostgreSQL.

## Stack

- **Runtime:** Node.js
- **Framework:** Express 4
- **ORM:** Prisma 5 (PostgreSQL)
- **Auth:** JWT + bcryptjs
- **Upload:** Supabase Storage
- **Email:** Resend
- **Pagamentos:** Stripe
- **Deploy:** Railway

## Setup local

### Pré-requisitos

- Node.js 18+
- Docker (para PostgreSQL local)

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
# Edite .env com seus valores
```

### 3. Subir PostgreSQL local

```bash
docker-compose up -d
```

### 4. Rodar migrations

```bash
npm run migrate:dev
```

### 5. (Opcional) Popular banco com dados iniciais

```bash
npm run seed
```

### 6. Iniciar servidor de desenvolvimento

```bash
npm run dev
# Servidor rodando em http://localhost:3001
```

## Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Servidor com hot-reload (nodemon) |
| `npm start` | Servidor em produção |
| `npm run migrate:dev` | Criar/aplicar migration em dev |
| `npm run migrate` | Aplicar migrations em produção |
| `npm run seed` | Popular banco com categorias e dados iniciais |
| `npm run studio` | Abrir Prisma Studio (visualizar banco) |

## Endpoints

| Módulo | Base path | Descrição |
|---|---|---|
| Auth | `/api/auth` | Registro, login, JWT, reset de senha |
| Profiles | `/api/profiles` | CRUD de portfólios de profissionais |
| Posts | `/api/posts` | Posts por profissional |
| Feed | `/api/feed` | Feed editorial (admin) |
| Reviews | `/api/reviews` | Avaliações de perfis |
| Upload | `/api/upload` | Upload de foto/vídeo (Supabase Storage) |
| Contact | `/api/contact` | Formulário de contato (email via Resend) |
| Admin | `/api/admin` | Painel admin (requer isAdmin=true) |
| Payments | `/api/payments` | Checkout e webhook Stripe |
| Partnerships | `/api/partnerships` | Propostas de parceria |

Health check: `GET /api/health`

## Autenticação

Rotas protegidas exigem header:

```
Authorization: Bearer <jwt_token>
```

Rotas admin exigem `isAdmin: true` no usuário.

### Tornar usuário admin

```bash
node prisma/make-admin.js email@exemplo.com
```

## Deploy (Railway)

O deploy é automático via `railway.toml`. Na primeira vez:

1. Criar projeto no [Railway](https://railway.app)
2. Adicionar serviço PostgreSQL
3. Configurar variáveis de ambiente (copiar de `.env.example`)
4. Conectar repositório GitHub — Railway detecta o `railway.toml` automaticamente

As migrations rodam automaticamente no startup (`npx prisma migrate deploy && node src/server.js`).

## Modelo de dados resumido

```
User (1) ──── (1) Profile
Profile (1) ── (N) Service
Profile (N) ── (M) Category
Profile (1) ── (N) Review
Profile (1) ── (N) Post
User (1) ──── (N) FeedPost
```
