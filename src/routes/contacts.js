// src/routes/contacts.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Todos os endpoints exigem autenticação
router.use(authMiddleware);

// ─── GET /api/contacts ───────────────────────────────────────────────────────
// Retorna todos os contatos do usuário logado
router.get('/', async (req, res) => {
  try {
    const contacts = await prisma.contact.findMany({
      where: { userId: req.user.id },
      orderBy: { score: 'desc' },
    });
    return res.json(contacts);
  } catch (err) {
    console.error('[CONTACTS] GET erro:', err);
    return res.status(500).json({ error: 'Erro ao buscar contatos.' });
  }
});

// ─── POST /api/contacts/bulk ─────────────────────────────────────────────────
// Recebe array de contatos, faz upsert pelo par (userId + telefone + nome)
// Duplicatas dentro do mesmo envio são ignoradas pelo banco
router.post('/bulk', async (req, res) => {
  const { contacts } = req.body;

  if (!Array.isArray(contacts) || contacts.length === 0) {
    return res.status(400).json({ error: 'Array de contatos vazio ou inválido.' });
  }

  const userId = req.user.id;

  try {
    // Busca telefones já existentes deste usuário para evitar duplicatas
    const existing = await prisma.contact.findMany({
      where: { userId },
      select: { telefone: true, nome: true },
    });

    const existingKeys = new Set(
      existing.map(c => normalizeKey(c.telefone + c.nome))
    );

    const toInsert = contacts
      .filter(c => {
        const key = normalizeKey((c.telefone || '') + (c.nome || ''));
        if (existingKeys.has(key)) return false;
        existingKeys.add(key); // evita duplicata dentro do próprio payload
        return true;
      })
      .map(c => ({
        userId,
        nome:     String(c.nome     || '').slice(0, 255),
        telefone: String(c.telefone || '').slice(0, 30),
        email:    String(c.email    || '').slice(0, 255),
        cidade:   String(c.cidade   || '').slice(0, 100),
        estado:   String(c.estado   || '').slice(0, 10),
        tipo:     String(c.tipo     || '').slice(0, 100),
        fonte:    String(c.fonte    || '').slice(0, 255),
        obs:      String(c.obs      || '').slice(0, 500),
        origem:   String(c.origem   || '').slice(0, 255),
        score:    Number(c.score)   || 0,
        status:   String(c.status   || 'valido').slice(0, 30),
      }));

    if (toInsert.length === 0) {
      return res.json({ inserted: 0, skipped: contacts.length });
    }

    // createMany é muito mais rápido que N inserts individuais
    const result = await prisma.contact.createMany({
      data: toInsert,
      skipDuplicates: true,
    });

    return res.json({
      inserted: result.count,
      skipped: contacts.length - result.count,
    });
  } catch (err) {
    console.error('[CONTACTS] BULK erro:', err);
    return res.status(500).json({ error: 'Erro ao salvar contatos.' });
  }
});

// ─── DELETE /api/contacts ────────────────────────────────────────────────────
// Apaga todos os contatos do usuário (reset)
router.delete('/', async (req, res) => {
  try {
    const { count } = await prisma.contact.deleteMany({
      where: { userId: req.user.id },
    });
    return res.json({ deleted: count });
  } catch (err) {
    console.error('[CONTACTS] DELETE erro:', err);
    return res.status(500).json({ error: 'Erro ao deletar contatos.' });
  }
});

// ─── DELETE /api/contacts/:id ────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido.' });

  try {
    // Garante que o contato pertence ao usuário
    const contact = await prisma.contact.findFirst({
      where: { id, userId: req.user.id },
    });
    if (!contact) return res.status(404).json({ error: 'Contato não encontrado.' });

    await prisma.contact.delete({ where: { id } });
    return res.json({ deleted: 1 });
  } catch (err) {
    console.error('[CONTACTS] DELETE/:id erro:', err);
    return res.status(500).json({ error: 'Erro ao deletar contato.' });
  }
});

// ─── Helpers ─────────────────────────────────────────────────────────────────
function normalizeKey(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]/g, '');
}

module.exports = router;
