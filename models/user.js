const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: {
            msg: "Username must be an email"
          }
      },
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    disabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      }
  },
  {
    sequelize,
    underscored: true,
    modelName: 'user',
  }
)

module.exports = User
