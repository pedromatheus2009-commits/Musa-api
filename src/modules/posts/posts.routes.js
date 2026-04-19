const router = require('express').Router()
const { verifyJWT } = require('../../middleware/auth')
const { validate } = require('../../middleware/validate')
const requireSubscription = require('../../middleware/requireSubscription')
const { createPostSchema, updatePostSchema } = require('./posts.schema')
const ctrl = require('./posts.controller')

router.get('/profile/:profileId', ctrl.list)
router.post('/', verifyJWT, requireSubscription, validate(createPostSchema), ctrl.create)
router.put('/:id', verifyJWT, requireSubscription, validate(updatePostSchema), ctrl.update)
router.delete('/:id', verifyJWT, ctrl.remove)

module.exports = router
