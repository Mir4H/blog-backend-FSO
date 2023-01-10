const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const router = require('express').Router()
const { SECRET } = require('../util/config')
const User = require('../models/user')
const Session = require('../models/session')

router.post('/', async (request, response) => {
  const body = request.body
  const user = await User.findOne({
    where: {
      username: body.username,
    },
  })
  const session = await Session.findOne({ where: { userId: user.id } })
  const passwordCorrect =
    user === null
      ? false
      : await bcrypt.compare(body.password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password',
    })
  }

  if (user.disabled) {
    if (session) {
      await session.destroy()
    }
    return response.status(403).json({
      error: 'Access denied, account disabled',
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }
  const token = jwt.sign(userForToken, SECRET)

  if (session) {
    session.update({ token: token })
    console.log('token updated')
  } else {
    await Session.create({ userId: user.id, token: token })
    console.log('token saved')
  }

  response.status(200).send({ token, username: user.username, name: user.name })
})

module.exports = router
