# Gutowski Mailing — Backend

API REST em Node.js + Express + Prisma + PostgreSQL para o sistema de mailing.

---

## Estrutura

```
backend/
├── prisma/
│   ├── schema.prisma       # Modelos User e Contact
│   └── seed.js             # Cria usuários padrão
├── src/
│   ├── middleware/
│   │   └── auth.js         # Validação JWT
│   ├── routes/
│   │   ├── auth.js         # POST /api/auth/login
│   │   └── contacts.js     # GET/POST/DELETE /api/contacts
│   └── index.js            # Entry point Express
├── .env.example
├── package.json
└── railway.toml
```

---

## Deploy no Railway (passo a passo)

### 1. Criar repositório no GitHub
```bash
git init
git add .
git commit -m "feat: backend gutowski mailing v1"
git remote add origin https://github.com/SEU_USUARIO/gutowski-mailing-backend.git
git push -u origin main
```

### 2. Criar projeto no Railway
- Acesse [railway.app](https://railway.app) → **New Project**
- Escolha **Deploy from GitHub repo** → selecione o repositório

### 3. Adicionar banco de dados Postgres
- No projeto Railway → **New** → **Database** → **Add PostgreSQL**
- O Railway gera a `DATABASE_URL` automaticamente

### 4. Configurar variáveis de ambiente
No Railway → seu serviço → aba **Variables**, adicione:

| Variável | Valor |
|---|---|
| `DATABASE_URL` | *(gerado pelo plugin Postgres — copie de lá)* |
| `ALLOWED_ORIGINS` | `https://mailing.gutowskicobrancagarantida.com.br` |
| `JWT_SECRET` | uma string longa e aleatória |
| `NODE_ENV` | `production` |

### 5. Configurar domínio customizado
- Railway → seu serviço → aba **Settings** → **Domains**
- Aponte `mailing.gutowskicobrancagarantida.com.br` para o domínio gerado pelo Railway

### 6. Rodar o seed (criar usuários padrão)
Após o primeiro deploy com sucesso, no terminal Railway:
```bash
railway run npm run seed
```

Ou na aba **Railway Shell** do serviço, execute:
```
node prisma/seed.js
```

---

## Usuários padrão (criados pelo seed)

| Email | Senha | Role |
|---|---|---|
| admin@gutowski.com.br | Gutowski@2025 | admin |
| operador@gutowski.com.br | Gutowski@2025 | user |

⚠️ **Troque as senhas após o primeiro login!**

---

## Endpoints

### Auth
| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/auth/login` | Login, retorna JWT |
| POST | `/api/auth/logout` | Logout (stateless) |

**Body login:**
```json
{ "email": "admin@gutowski.com.br", "password": "Gutowski@2025" }
```

**Resposta:**
```json
{ "token": "eyJ...", "user": { "id": 1, "email": "...", "name": "Admin", "role": "admin" } }
```

### Contacts (requer `Authorization: Bearer TOKEN`)
| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/contacts` | Lista todos os contatos do usuário |
| POST | `/api/contacts/bulk` | Importa array de contatos (deduplicado) |
| DELETE | `/api/contacts` | Apaga todos os contatos do usuário |
| DELETE | `/api/contacts/:id` | Apaga um contato específico |

**Body bulk:**
```json
{
  "contacts": [
    {
      "nome": "Condomínio Exemplo",
      "telefone": "48991234455",
      "email": "exemplo@email.com",
      "cidade": "Florianópolis",
      "estado": "SC",
      "tipo": "Residencial",
      "fonte": "MAILING_MASTER.csv",
      "score": 70,
      "status": "valido"
    }
  ]
}
```

---

## Desenvolvimento local

```bash
npm install
cp .env.example .env
# edite .env com sua DATABASE_URL local

npx prisma db push
node prisma/seed.js
npm run dev
```
