const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const categorias = [
  'Saúde',
  'Beleza & Estética',
  'Tatuagem & Body Art',
  'Culinária & Gastronomia',
  'Arte & Criação',
  'Eventos & Hospitalidade',
  'Casa & Cuidado',
  'Transporte',
  'Educação',
  'Administrativo & Negócios',
  'Tecnologia & Digital',
  'Moda & Imagem',
  'Bem-estar & Esporte',
  'Construção & Técnicos',
  'Jurídico & Finanças',
]

// Renomear 'Jurídico' → 'Jurídico & Finanças'
const renameMap = {
  'Jurídico': 'Jurídico & Finanças',
}

async function main() {
  // Renomear categorias antigas
  for (const [antigo, novo] of Object.entries(renameMap)) {
    const cat = await prisma.category.findFirst({ where: { nome: antigo } })
    if (cat) {
      const existing = await prisma.category.findFirst({ where: { nome: novo } })
      if (!existing) {
        await prisma.category.update({ where: { id: cat.id }, data: { nome: novo } })
        console.log(`✅ Renomeado: "${antigo}" → "${novo}"`)
      }
    }
  }

  // Criar/garantir todas as categorias
  for (const nome of categorias) {
    await prisma.category.upsert({
      where: { nome },
      update: {},
      create: { nome },
    })
    console.log(`✅ Categoria garantida: "${nome}"`)
  }

  console.log('\n🎉 Categorias atualizadas!')
}

main()
  .catch((e) => { console.error('Erro:', e.message); process.exit(1) })
  .finally(() => prisma.$disconnect())
