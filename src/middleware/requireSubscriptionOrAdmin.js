const { getSubscriptionStatus } = require('../modules/payments/payments.service')

async function requireSubscriptionOrAdmin(req, res, next) {
  try {
    if (req.user?.isAdmin) return next()
    const { active } = await getSubscriptionStatus(req.user.sub)
    if (!active) {
      return res.status(402).json({ error: 'Assinatura necessária para publicar no feed' })
    }
    next()
  } catch (err) { next(err) }
}

module.exports = requireSubscriptionOrAdmin
