const router = require('express').Router()
const rateLimit = require('express-rate-limit')
const { verifyJWT } = require('../../middleware/auth')
const { upload, uploadVideo } = require('../../middleware/upload')
const uploadReview = require('../../middleware/uploadReview')
const { uploadAvatar, uploadPostImage, uploadPostVideo, uploadReviewMedia } = require('./upload.controller')

const reviewUploadLimit = rateLimit({ windowMs: 15 * 60 * 1000, max: 15, standardHeaders: true, legacyHeaders: false })

router.post('/avatar', verifyJWT, upload.single('foto'), uploadAvatar)
router.post('/post-image', verifyJWT, upload.single('imagem'), uploadPostImage)
router.post('/post-video', verifyJWT, uploadVideo.single('video'), uploadPostVideo)
router.post('/review-media', reviewUploadLimit, uploadReview.single('arquivo'), uploadReviewMedia)

module.exports = router
