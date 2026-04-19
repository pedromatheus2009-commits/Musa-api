const prisma = require('../../config/database')

const reviewSelect = {
  id: true,
  autorNome: true,
  nota: true,
  comentario: true,
  createdAt: true,
  medias: { select: { id: true, tipo: true, url: true } },
}

async function listByProfile(profileId) {
  return prisma.review.findMany({
    where: { profileId },
    select: reviewSelect,
    orderBy: { createdAt: 'desc' },
  })
}

async function create(profileId, data) {
  const profile = await prisma.profile.findUnique({ where: { id: profileId }, select: { id: true } })
  if (!profile) {
    const err = new Error('Perfil não encontrado')
    err.status = 404
    throw err
  }

  const { medias, ...reviewData } = data

  const review = await prisma.review.create({
    data: {
      profileId,
      ...reviewData,
      ...(medias?.length && {
        medias: { create: medias.map(({ tipo, url }) => ({ tipo, url })) },
      }),
    },
    select: reviewSelect,
  })

  return review
}

module.exports = { listByProfile, create }
