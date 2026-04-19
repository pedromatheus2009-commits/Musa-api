const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const profiles = await prisma.profile.findMany({
    select: {
      nome: true,
      role: true,
      ativo: true,
      aprovado: true,
      categories: {
        select: { category: { select: { nome: true } } },
      },
    },
    orderBy: { nome: 'asc' },
  })

  console.log('\n📋 PERFIS E CATEGORIAS NO BANCO:\n')
  for (const p of profiles) {
    const cats = p.categories.map((c) => c.category.nome).join(', ') || '(sem categoria)'
    const status = `ativo:${p.ativo} aprovado:${p.aprovado}`
    console.log(`👤 ${p.nome} | role: ${p.role} | cats: [${cats}] | ${status}`)
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
