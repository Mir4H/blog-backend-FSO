const router = require('express').Router()
const { Blog } = require('../models')
const { User } = require('../models')
const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')
const { tokenExtractor, blogFinder } = require('../util/controllers')
const { Op } = require('sequelize')

router.get('/', async (req, res) => {
  let where = {}
  if (req.query.search) {
    where = {
          [Op.or]: [
            {
              title: {
                [Op.substring]: req.query.search.toLowerCase(),
              }
            },
            {
              author: {
                [Op.substring]: req.query.search.toLowerCase(),
              }
            }
          ]
        }
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name'],
    },
    where,
    order: [
        ['likes', 'DESC']]
  })
  res.json(blogs)
})

router.post('/', tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  const blog = await Blog.create({ ...req.body, userId: user.id })
  res.status(201).json(blog)
})

router.delete('/:id', blogFinder, tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  if (req.blog) {
    if (req.blog.userId === user.id) {
      await req.blog.destroy()
      res.status(204).end()
    } else {
      return res.status(401).json({ error: 'Only creator can remove blogs' })
    }
  } else {
    return res.status(401).json({ error: 'Blog does not exist' })
  }
})

router.put('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    req.blog.likes = req.body.likes
    await req.blog.save()
    res.json(req.blog)
  } else {
    res.status(404).end()
  }
})

module.exports = router
