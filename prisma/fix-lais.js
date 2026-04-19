const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Busca pelo role para não depender do nome exato
  const profile = await prisma.profile.findFirst({
    where: { role: { contains: 'Fisioterapeuta', mode: 'insensitive' } },
    select: { id: true, nome: true, categories: { select: { category: { select: { nome: true } } } } },
  })

  if (!profile) { console.log('⚠️  Perfil de fisioterapeuta não encontrado'); return }

  console.log(`👤 ${profile.nome}`)
  console.log(`   Categoria atual: [${profile.categories.map(c => c.category.nome).join(', ') || 'sem categoria'}]`)

  const cat = await prisma.category.findFirst({ where: { nome: { equals: 'Saúde', mode: 'insensitive' } } })
  if (!cat) { console.log('⚠️  Categoria Saúde não encontrada no banco'); return }

  await prisma.profileCategory.deleteMany({ where: { profileId: profile.id } })
  await prisma.profileCategory.create({ data: { profileId: profile.id, categoryId: cat.id } })
  console.log('✅ Categoria "Saúde" atribuída com sucesso!')
}

main()
  .catch((e) => { console.error('Erro:', e.message); process.exit(1) })
  .finally(() => prisma.$disconnect())
