const express = require('express')
const router = express.Router()
const { body, validationResult } = require('express-validator')
const {
  getUsers,
  register,
  login,
  profileUpdate,
} = require('../controllers/userController')
const User = require('../models/userModel')
const verifyToken = require('../middlewares/auth')

// Routes
router.get('/', verifyToken, getUsers)
router.post(
  '/register',
  body('name', 'Name=> name is required').not().isEmpty().trim(),
  body('username', 'Username=>  username is required and must be unique')
    .not()
    .isEmpty()
    .trim()
    .custom(async (value) => {
      const user = await User.findOne({ username: value })
      if (user) {
        return Promise.reject('Username=> username is not available')
      }
    }),

  body('email', ' Email => email is required, and must be unique.  ')
    .isEmail()
    .normalizeEmail()
    .trim()
    .custom(async (value) => {
      const user = await User.findOne({ email: value })
      if (user) {
        return Promise.reject('Email Already in use Must be unique')
      }
    }),

  body('password', 'Password => password is required').not().isEmpty(),
  // .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm),
  register
)
router.post(
  '/login',
  body('email', " 'Email => ' email is required").not().isEmpty(),
  body('password', 'Password => password is required').not().isEmpty(),
  login
)
router.put('/profileUpdate', verifyToken, profileUpdate)

module.exports = router
