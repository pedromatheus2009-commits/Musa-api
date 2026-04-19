const prisma = require('../../config/database')

const PORTFOLIO_LIMIT = 10

const postSelect = {
  id: true,
  tipo: true,
  titulo: true,
  conteudo: true,
  imagemUrl: true,
  videoUrl: true,
  destaque: true,
  createdAt: true,
  updatedAt: true,
}

async function listByProfile(profileId, tipo) {
  return prisma.post.findMany({
    where: { profileId, ...(tipo && { tipo }) },
    select: postSelect,
    orderBy: [{ destaque: 'desc' }, { createdAt: 'desc' }],
  })
}

async function create(profileId, data) {
  const { destaque = false, tipo = 'portfolio', ...rest } = data

  if (tipo === 'portfolio') {
    const count = await prisma.post.count({ where: { profileId, tipo: 'portfolio' } })
    if (count >= PORTFOLIO_LIMIT) {
      const err = new Error(`Limite de ${PORTFOLIO_LIMIT} posts no portfólio atingido`)
      err.status = 422
      throw err
    }
  }

  if (destaque) {
    await prisma.post.updateMany({ where: { profileId, destaque: true }, data: { destaque: false } })
  }

  return prisma.post.create({
    data: { profileId, tipo, destaque, ...rest },
    select: postSelect,
  })
}

async function update(id, profileId, data) {
  await assertOwner(id, profileId)
  const { destaque, ...rest } = data

  if (destaque === true) {
    await prisma.post.updateMany({ where: { profileId, destaque: true }, data: { destaque: false } })
  }

  return prisma.post.update({
    where: { id },
    data: { ...rest, ...(destaque !== undefined && { destaque }) },
    select: postSelect,
  })
}

async function remove(id, profileId) {
  await assertOwner(id, profileId)
  await prisma.post.delete({ where: { id } })
}

async function assertOwner(id, profileId) {
  const post = await prisma.post.findUnique({ where: { id }, select: { profileId: true } })
  if (!post) {
    const err = new Error('Publicação não encontrada')
    err.status = 404
    throw err
  }
  if (post.profileId !== profileId) {
    const err = new Error('Sem permissão')
    err.status = 403
    throw err
  }
}

module.exports = { listByProfile, create, update, remove }
