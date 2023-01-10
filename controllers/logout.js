const router = require('express').Router()
const User = require('../models/user')
const Session = require('../models/session')
const { tokenExtractor } = require('../util/controllers')

router.delete('/', tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  const token = await Session.findOne({ where: { userId: user.id } })
  if (user && token) {
    await token.destroy()
  } else {
    res.status(404).end()
  }
  res.status(200).json({ message: 'Logged out' })
})

module.exports = router
