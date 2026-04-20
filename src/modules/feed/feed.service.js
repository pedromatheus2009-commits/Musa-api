const prisma = require('../../config/database')

const postSelect = {
  id: true,
  userId: true,
  titulo: true,
  conteudo: true,
  imagemUrl: true,
  videoUrl: true,
  publicado: true,
  createdAt: true,
  user: { select: { nome: true, isAdmin: true } },
  profile: { select: { id: true, nome: true, fotoUrl: true, slug: true, role: true } },
  _count: { select: { likes: true, comments: true } },
}

async function list({ includeUnpublished = false, userId = null } = {}) {
  const posts = await prisma.feedPost.findMany({
    where: includeUnpublished ? {} : { publicado: true },
    select: postSelect,
    orderBy: { createdAt: 'desc' },
  })

  if (!userId) return posts

  const likedIds = await prisma.feedLike.findMany({
    where: { userId, feedPostId: { in: posts.map((p) => p.id) } },
    select: { feedPostId: true },
  })
  const likedSet = new Set(likedIds.map((l) => l.feedPostId))
  return posts.map((p) => ({ ...p, likedByMe: likedSet.has(p.id) }))
}

async function findById(id) {
  const post = await prisma.feedPost.findUnique({ where: { id }, select: postSelect })
  if (!post) {
    const err = new Error('Publicação não encontrada')
    err.status = 404
    throw err
  }
  return post
}

async function listMy(userId) {
  const posts = await prisma.feedPost.findMany({
    where: { userId },
    select: postSelect,
    orderBy: { createdAt: 'desc' },
  })
  const likedIds = await prisma.feedLike.findMany({
    where: { userId, feedPostId: { in: posts.map((p) => p.id) } },
    select: { feedPostId: true },
  })
  const likedSet = new Set(likedIds.map((l) => l.feedPostId))
  return posts.map((p) => ({ ...p, likedByMe: likedSet.has(p.id) }))
}

async function create(userId, data) {
  const profile = await prisma.profile.findUnique({ where: { userId }, select: { id: true } })
  return prisma.feedPost.create({
    data: { userId, profileId: profile?.id ?? null, ...data },
    select: postSelect,
  })
}

async function update(id, data) {
  const post = await prisma.feedPost.findUnique({ where: { id } })
  if (!post) {
    const err = new Error('Publicação não encontrada')
    err.status = 404
    throw err
  }
  return prisma.feedPost.update({ where: { id }, data, select: postSelect })
}

async function remove(id) {
  await prisma.feedPost.delete({ where: { id } })
}

async function toggleLike(feedPostId, userId) {
  const existing = await prisma.feedLike.findUnique({
    where: { feedPostId_userId: { feedPostId, userId } },
  })
  if (existing) {
    await prisma.feedLike.delete({ where: { feedPostId_userId: { feedPostId, userId } } })
    return { liked: false }
  }
  await prisma.feedLike.create({ data: { feedPostId, userId } })
  return { liked: true }
}

async function listComments(feedPostId) {
  const all = await prisma.feedComment.findMany({
    where: { feedPostId },
    select: { id: true, autorNome: true, texto: true, parentId: true, createdAt: true, userId: true },
    orderBy: { createdAt: 'asc' },
  })
  const roots = all.filter((c) => !c.parentId)
  const byParent = {}
  all.filter((c) => c.parentId).forEach((c) => {
    if (!byParent[c.parentId]) byParent[c.parentId] = []
    byParent[c.parentId].push(c)
  })
  return roots.map((c) => ({ ...c, replies: byParent[c.id] || [] }))
}

async function createComment(feedPostId, userId, { autorNome, texto, parentId = null }) {
  return prisma.feedComment.create({
    data: { feedPostId, userId, autorNome, texto, parentId },
    select: { id: true, autorNome: true, texto: true, parentId: true, createdAt: true, userId: true },
  })
}

async function deleteComment(id, userId, isAdmin) {
  const comment = await prisma.feedComment.findUnique({ where: { id }, select: { userId: true } })
  if (!comment) {
    const err = new Error('Comentário não encontrado')
    err.status = 404
    throw err
  }
  if (!isAdmin && comment.userId !== userId) {
    const err = new Error('Sem permissão')
    err.status = 403
    throw err
  }
  await prisma.feedComment.delete({ where: { id } })
}

module.exports = { list, listMy, findById, create, update, remove, toggleLike, listComments, createComment, deleteComment }
