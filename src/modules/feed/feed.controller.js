const service = require('./feed.service')

async function list(req, res, next) {
  try {
    const posts = await service.list({ includeUnpublished: false, userId: req.user?.sub ?? null })
    res.json(posts)
  } catch (err) { next(err) }
}

async function listAll(req, res, next) {
  try {
    const posts = await service.list({ includeUnpublished: true })
    res.json(posts)
  } catch (err) { next(err) }
}

async function getOne(req, res, next) {
  try {
    const post = await service.findById(req.params.id)
    res.json(post)
  } catch (err) { next(err) }
}

async function create(req, res, next) {
  try {
    const post = await service.create(req.user.sub, req.body)
    res.status(201).json(post)
  } catch (err) { next(err) }
}

async function update(req, res, next) {
  try {
    const post = await service.update(req.params.id, req.body)
    res.json(post)
  } catch (err) { next(err) }
}

async function remove(req, res, next) {
  try {
    const post = await service.findById(req.params.id)
    if (!req.user.isAdmin && post.userId !== req.user.sub) {
      return res.status(403).json({ error: 'Sem permissão para excluir esta publicação' })
    }
    await service.remove(req.params.id)
    res.status(204).end()
  } catch (err) { next(err) }
}

async function like(req, res, next) {
  try {
    const result = await service.toggleLike(req.params.id, req.user.sub)
    res.json(result)
  } catch (err) { next(err) }
}

async function getComments(req, res, next) {
  try {
    const comments = await service.listComments(req.params.id)
    res.json(comments)
  } catch (err) { next(err) }
}

async function createComment(req, res, next) {
  try {
    const { autorNome, texto, parentId } = req.body
    if (!autorNome?.trim() || !texto?.trim()) {
      return res.status(400).json({ error: 'autorNome e texto são obrigatórios' })
    }
    const comment = await service.createComment(req.params.id, req.user.sub, { autorNome, texto, parentId })
    res.status(201).json(comment)
  } catch (err) { next(err) }
}

async function deleteComment(req, res, next) {
  try {
    await service.deleteComment(req.params.commentId, req.user.sub, req.user.isAdmin)
    res.status(204).end()
  } catch (err) { next(err) }
}

module.exports = { list, listAll, getOne, create, update, remove, like, getComments, createComment, deleteComment }
