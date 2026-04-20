require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

function toSlug(str) {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
}

async function main() {
  const profiles = await prisma.profile.findMany({ where: { slug: null }, select: { id: true, nome: true } })
  console.log(`Gerando slugs para ${profiles.length} perfis...`)
  const usedSlugs = new Set()

  for (const p of profiles) {
    const base = toSlug(p.nome)
    let slug = base
    let n = 2
    while (usedSlugs.has(slug)) {
      slug = `${base}-${n++}`
    }
    // checar no banco também
    let existing = await prisma.profile.findFirst({ where: { slug } })
    while (existing) {
      slug = `${base}-${n++}`
      existing = await prisma.profile.findFirst({ where: { slug } })
    }
    usedSlugs.add(slug)
    await prisma.profile.update({ where: { id: p.id }, data: { slug } })
    console.log(`  ${p.nome} → ${slug}`)
  }
  console.log('Concluído.')
}

main().finally(() => prisma.$disconnect())
