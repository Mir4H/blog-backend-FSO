const bcrypt = require('bcrypt')
const router = require('express').Router()
const { User, UserReadings, Blog } = require('../models')
const { tokenExtractor, checkToken } = require('../util/controllers')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] },
    },
  })
  res.json(users)
})

router.post('/', async (req, res) => {
  const { username, name, password } = req.body
  const saltRounds = 10
  if (password) {
    const passwordHash = await bcrypt.hash(password, saltRounds)
    const user = await User.create({
      username,
      name,
      passwordHash,
    })
    res.json(user)
  } else {
    return res.status(401).json({
      error: 'Password not provided',
    })
  }
})

router.put('/:username', tokenExtractor, checkToken, async (req, res) => {
  const user = await User.findOne({ where: { username: req.params.username } })
  if (user) {
    if (user.id === req.decodedToken.id) {
        user.username = req.body.username
        await user.save()
        res.json(user)
    } else {
        return res.status(401).json({ error: 'Only own account can be modified' })
      }
  } else {
    res.status(404).end()
  }
})

router.get('/:id', async (req, res) => {
    const where = {}
    if (req.query.read) {
      where.read = req.query.read
    }
  const user = await User.findByPk(req.params.id, {
    attributes: ['name', 'username'],
    include: [
      {
        model: Blog,
        as: 'readings',
        attributes: { exclude: ['userId', 'createdAt', 'updatedAt'] },
        through: {
          attributes: ['id', 'read'],
          where
        },
      },
    ],
  })

  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

module.exports = router
