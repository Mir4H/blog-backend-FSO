const router = require('express').Router()
const ReadingList = require('../models/readinglist')
const { tokenExtractor, checkToken } = require('../util/controllers')
const { User } = require('../models')

router.post('/', async (req, res) => {
  const { user_id, blog_id } = req.body
  const readinglist = await ReadingList.create({
    userId: user_id,
    blogId: blog_id,
  })
  res.status(201).json(readinglist)
})

router.put('/:id', tokenExtractor, checkToken, async (req, res) => {
  const reading = await ReadingList.findByPk(req.params.id)
  const user = await User.findByPk(req.decodedToken.id)

  if (reading) {
    if (reading.userId === user.id) {
      reading.read = req.body.read
      await reading.save()
      res.json(reading)
    } else {
      return res.status(401).json({ error: 'Only owner can modify readinglist' })
    }
  } else {
    return res.status(401).json({ error: 'Reading does not exist' })
  }
})


module.exports = router
