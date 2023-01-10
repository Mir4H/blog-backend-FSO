const Blog = require('./blog')
const User = require('./user')
const UserReadings = require('./readinglist')

User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog, {through: UserReadings, as: 'readings'})
Blog.belongsToMany(User, {through: UserReadings, as: 'readinglists'})

module.exports = { Blog, User, UserReadings }
