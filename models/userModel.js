const mongoose = require('mongoose')
const schema = mongoose.Schema
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    username: {
      type: String,
      required: [true, 'Kindly add your username'],
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'Kindly add your email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Kindly Enter Password'],
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('User', userSchema)
