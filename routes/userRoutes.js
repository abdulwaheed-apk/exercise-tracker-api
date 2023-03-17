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
  body('name', '-m- name is required').not().isEmpty().trim(),
  body(
    'username',
    '-m- username is required and must contain at lest 8 characters total including at leat 1 number, one symbol, one small and capital letter,'
  )
    .not()
    .isEmpty()
    .trim()
    .custom(async (value) => {
      const user = await User.findOne({ username: value })
      if (user) {
        return Promise.reject('username is not available')
      }
    }),

  body('email', '-m- email is required')
    .isEmail()
    .normalizeEmail()
    .trim()
    .custom(async (value) => {
      const user = await User.findOne({ email: value })
      if (user) {
        return Promise.reject('Email Already in use Must be unique')
      }
    }),

  body('password', '-m- password is required').not().isEmpty(),
  // .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm),
  register
)
router.post(
  '/login',
  body('email', '-m- email is required').not().isEmpty(),
  body('password', '-m- password is required').not().isEmpty(),
  login
)
router.put('/profileUpdate', verifyToken, profileUpdate)

module.exports = router
