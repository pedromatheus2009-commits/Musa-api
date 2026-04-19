const prisma = require('../config/database')
const { getSubscriptionStatus } = require('../modules/payments/payments.service')

async function requireSubscription(req, res, next) {
  try {
    // getSubscriptionStatus já sincroniza com Stripe se o banco estiver desatualizado
    const { active } = await getSubscriptionStatus(req.user.sub)
    if (!active) {
      return res.status(402).json({ error: 'Assinatura necessária para publicar conteúdo' })
    }
    next()
  } catch (err) { next(err) }
}

module.exports = requireSubscription
