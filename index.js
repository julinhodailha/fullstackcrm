const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

// Configuração de Porta Dinâmica para o Railway
const PORT = process.env.PORT || 8080;

// Configuração de CORS para permitir que o seu Front-end acesse a API
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Rota de Teste (O Foguete 🚀)
app.get('/', (req, res) => {
  res.send('API Gutowski Mailing Online 🚀');
});

// ROTA DE LOGIN
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Login Simples para validação
    if (email === 'admin@gutowski.com.br' && password === 'admin123') {
      return res.json({
        token: 'sessao_ativa_gutowski',
        user: { name: 'Admin Gutowski', email: email }
      });
    }
    
    res.status(401).json({ message: 'Credenciais inválidas' });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
});

// INICIALIZAÇÃO DO SERVIDOR (O Pulo do Gato para o Railway)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando com sucesso na porta ${PORT} 🚀`);
});