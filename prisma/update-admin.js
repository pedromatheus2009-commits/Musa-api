const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const hash = await bcrypt.hash('Gu300890', 10)
  const user = await prisma.user.update({
    where: { email: 'admin@musacasa.com.br' },
    data: {
      email: 'pedromatheusbr@hotmail.com',
      password: hash,
      isAdmin: true,
    },
  })
  console.log('✅ Admin atualizado:', user.email)
}

main()
  .catch((e) => { console.error('Erro:', e.message); process.exit(1) })
  .finally(() => prisma.$disconnect())
