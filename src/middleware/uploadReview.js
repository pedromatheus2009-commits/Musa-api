const multer = require('multer')

const ALLOWED_TYPES = [
  'image/jpeg', 'image/png', 'image/webp',
  'video/mp4', 'video/webm', 'video/quicktime',
]
const MAX_SIZE = 50 * 1024 * 1024 // 50 MB (vídeo até 60s ~= 20-50 MB)

module.exports = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE },
  fileFilter(_req, file, cb) {
    if (ALLOWED_TYPES.includes(file.mimetype)) cb(null, true)
    else cb(new Error('Tipo de arquivo não permitido'))
  },
})
