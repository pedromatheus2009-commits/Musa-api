const router = require('express').Router()
const { verifyJWT, optionalJWT } = require('../../middleware/auth')
const { requireAdmin } = require('../../middleware/admin')
const requireSubscriptionOrAdmin = require('../../middleware/requireSubscriptionOrAdmin')
const { validate } = require('../../middleware/validate')
const { createFeedPostSchema, updateFeedPostSchema } = require('./feed.schema')
const ctrl = require('./feed.controller')

// Público (com auth opcional para likedByMe)
router.get('/', optionalJWT, ctrl.list)
router.get('/:id', ctrl.getOne)
router.get('/:id/comments', ctrl.getComments)

// Assinante ou admin pode postar
router.post('/', verifyJWT, requireSubscriptionOrAdmin, validate(createFeedPostSchema), ctrl.create)

// Logado pode curtir e comentar
router.post('/:id/like', verifyJWT, ctrl.like)
router.post('/:id/comments', verifyJWT, ctrl.createComment)
router.delete('/comments/:commentId', verifyJWT, ctrl.deleteComment)

// Admin only
router.get('/admin/all', verifyJWT, requireAdmin, ctrl.listAll)
router.put('/:id', verifyJWT, requireAdmin, validate(updateFeedPostSchema), ctrl.update)
router.delete('/:id', verifyJWT, requireAdmin, ctrl.remove)

module.exports = router
