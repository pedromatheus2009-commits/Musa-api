const prisma = require('../config/database')

async function requireSubscription(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.sub },
      select: { subscriptionStatus: true },
    })
    const active = user?.subscriptionStatus === 'active' || user?.subscriptionStatus === 'trialing'
    if (!active) {
      return res.status(402).json({ error: 'Assinatura necessária para publicar conteúdo' })
    }
    next()
  } catch (err) { next(err) }
}

module.exports = requireSubscription
