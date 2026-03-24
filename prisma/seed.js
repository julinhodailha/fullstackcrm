// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Rodando seed...');

  const users = [
    { email: 'admin@gutowski.com.br', password: 'Gutowski@2025', name: 'Admin', role: 'admin' },
    { email: 'operador@gutowski.com.br', password: 'Gutowski@2025', name: 'Operador', role: 'user' },
  ];

  for (const u of users) {
    const hash = await bcrypt.hash(u.password, 10);
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        email: u.email,
        password: hash,
        name: u.name,
        role: u.role,
      },
    });
    console.log(`✅ Usuário criado/verificado: ${u.email}`);
  }

  console.log('✅ Seed concluído!');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
