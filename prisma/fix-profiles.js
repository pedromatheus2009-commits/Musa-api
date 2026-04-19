const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const fixes = [
  { nome: 'Lais leal',      role: 'Fisioterapeuta',     categoria: 'Saúde' },
  { nome: 'Mariana Torres', role: 'Chef & Confeiteira',  categoria: 'Culinária & Gastronomia' },
]

async function assignCategory(profileId, categoriaName) {
  const cat = await prisma.category.findFirst({ where: { nome: { equals: categoriaName, mode: 'insensitive' } } })
  if (!cat) { console.log(`  ⚠️  Categoria não encontrada: "${categoriaName}"`); return }

  // Remove categorias antigas e adiciona a correta
  await prisma.profileCategory.deleteMany({ where: { profileId } })
  await prisma.profileCategory.create({ data: { profileId, categoryId: cat.id } })
  console.log(`  ✅ Categoria "${categoriaName}" atribuída`)
}

async function main() {
  for (const fix of fixes) {
    const profile = await prisma.profile.findFirst({
      where: { nome: { equals: fix.nome, mode: 'insensitive' } },
      select: { id: true, nome: true, categories: { select: { category: { select: { nome: true } } } } },
    })

    if (!profile) { console.log(`⚠️  Perfil não encontrado: ${fix.nome}`); continue }

    console.log(`\n👤 ${profile.nome}`)
    console.log(`   Categoria atual: [${profile.categories.map(c => c.category.nome).join(', ') || 'sem categoria'}]`)
    console.log(`   → Corrigindo para: "${fix.categoria}"`)
    await assignCategory(profile.id, fix.categoria)
  }

  console.log('\n🎉 Correções aplicadas!')
}

main()
  .catch((e) => { console.error('Erro:', e.message); process.exit(1) })
  .finally(() => prisma.$disconnect())
