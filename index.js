const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Configurações iniciais
app.use(express.json());
app.use(cors());

// Cabeçalhos de segurança (CORS)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// ROTA PRINCIPAL (O Foguete 🚀)
app.get('/', (req, res) => {
  res.send('API Gutowski Mailing Online 🚀');
});

// ROTA DE LOGIN
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Login Simples para teste
    if (email === 'admin@gutowski.com.br' && password === 'admin123') {
      return res.json({
        token: 'sessao_ativa_gutowski',
        user: { name: 'Admin Gutowski', email }
      });
    }
    
    res.status(401).json({ message: 'Credenciais inválidas' });
  } catch (error) {
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
});

// Ligar o servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});