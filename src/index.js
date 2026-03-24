const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// --- CONFIGURAÇÃO DE SEGURANÇA (CORS) ---
app.use(express.json());
app.use(cors()); 

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// --- ROTA DE TESTE (Para ver se o site está vivo) ---
app.get('/', (req, res) => {
  res.send('API Gutowski Mailing Online 🚀');
});

// --- ROTA DE LOGIN ---
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  // Login fixo para teste inicial (Como está no seu front-end)
  if (email === 'admin@gutowski.com.br' && password === 'admin123') {
    return res.json({
      token: 'token-gerado-pelo-servidor',
      user: { name: 'Admin Gutowski', email: email }
    });
  }

  res.status(401).json({ message: 'E-mail ou senha incorretos' });
});

// --- INICIALIZAÇÃO DO SERVIDOR ---
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});