const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('blogs', 'year', {
      type: DataTypes.INTEGER,
      validate: {
        min: {
          args: 1991,
          msg: 'Year must be after 1991',
        },
        max: {
          args: new Date().getFullYear(),
          msg: "Year can't be in the future",
        },
      },
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('blogs', 'year')
  },
}
