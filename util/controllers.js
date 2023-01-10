const router = require('express').Router()
const { Blog, Session, User } = require('../models')

const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      console.log(authorization.substring(7))
      req.token = authorization.substring(7)
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch (error) {
      console.log(error)
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

const checkToken = async (req, res, next) => {
  const tokenInUse = req.token
  const session = await Session.findOne({
    where: { userId: req.decodedToken.id },
  })
  const user = await User.findByPk(req.decodedToken.id)
  if (session) {
    if (session.token === tokenInUse && !user.disabled) {
      console.log('session ok')
    } else {
        await session.destroy()
        return res.status(403).json({ error: 'invalid session, access denied' })
      }
  } else {
    return res.status(403).json({ error: 'access denied, please login' })
  }
  next()
}

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

module.exports = { tokenExtractor, blogFinder, checkToken }
