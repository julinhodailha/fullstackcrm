// src/index.js
const express = require('express');
const cors    = require('cors');

const authRoutes     = require('./routes/auth');
const contactRoutes  = require('./routes/contacts');

const app  = express();
const PORT = process.env.PORT || 3000;

// ─── CORS ────────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

// Em desenvolvimento sem variável definida, aceita tudo
const corsOptions = {
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      cb(null, true);
    } else {
      cb(new Error(`CORS bloqueado para origem: ${origin}`));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // preflight

// ─── BODY PARSER ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' })); // payload de contatos pode ser grande

// ─── HEALTH CHECK ────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    service: 'Gutowski Mailing API',
    version: '1.0.0',
    status: 'ok',
    ts: new Date().toISOString(),
  });
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// ─── ROTAS ───────────────────────────────────────────────────────────────────
app.use('/api/auth',     authRoutes);
app.use('/api/contacts', contactRoutes);

// ─── 404 ─────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Rota não encontrada: ${req.method} ${req.path}` });
});

// ─── ERROR HANDLER ───────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  res.status(500).json({ error: err.message || 'Erro interno.' });
});

// ─── START ───────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Gutowski Mailing API rodando na porta ${PORT}`);
  console.log(`   Origens permitidas: ${allowedOrigins.join(', ') || '* (todas)'}`);
});
