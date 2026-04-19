const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Mapeamento: nome antigo (no banco) → nome novo (igual ao frontend)
const renameMap = {
  'Fotografia':        'Arte & Criação',
  'Design':            'Construção & Técnicos',
  'Saúde & Bem-estar': 'Bem-estar & Esporte',
  'Moda & Estilo':     'Moda & Imagem',
  'Gastronomia':       'Eventos & Hospitalidade',
  'Tecnologia':        'Tecnologia & Digital',
  'Educação & Coaching': 'Educação',
  'Beleza':            'Beleza & Estética',
}

// Categorias que existem no frontend mas não estão no banco ainda
const novasCategories = [
  'Saúde',
  'Casa & Cuidado',
  'Transporte',
  'Administrativo & Negócios',
  'Jurídico',
]

async function main() {
  console.log('🔄 Renomeando categorias existentes...')
  for (const [antigo, novo] of Object.entries(renameMap)) {
    const cat = await prisma.category.findFirst({ where: { nome: antigo } })
    if (cat) {
      // Verifica se já existe uma categoria com o novo nome
      const existing = await prisma.category.findFirst({ where: { nome: novo } })
      if (existing) {
        // Migra as associações para a categoria existente
        await prisma.profileCategory.updateMany({
          where: { categoryId: cat.id },
          data: { categoryId: existing.id },
        })
        await prisma.category.delete({ where: { id: cat.id } })
        console.log(`  ✅ Migrado: "${antigo}" → "${novo}" (categoria já existia)`)
      } else {
        await prisma.category.update({ where: { id: cat.id }, data: { nome: novo } })
        console.log(`  ✅ Renomeado: "${antigo}" → "${novo}"`)
      }
    } else {
      console.log(`  ⚠️  Não encontrado: "${antigo}"`)
    }
  }

  console.log('\n➕ Criando categorias novas...')
  for (const nome of novasCategories) {
    await prisma.category.upsert({
      where: { nome },
      update: {},
      create: { nome },
    })
    console.log(`  ✅ Criada: "${nome}"`)
  }

  console.log('\n🎉 Categorias corrigidas!')
}

main()
  .catch((e) => { console.error('Erro:', e.message); process.exit(1) })
  .finally(() => prisma.$disconnect())
