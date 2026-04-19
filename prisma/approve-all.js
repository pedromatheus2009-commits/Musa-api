const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const result = await prisma.profile.updateMany({
    where: { aprovado: false },
    data: { aprovado: true },
  })
  console.log(`✅ ${result.count} perfis aprovados!`)
}

main()
  .catch((e) => { console.error('Erro:', e.message); process.exit(1) })
  .finally(() => prisma.$disconnect())
